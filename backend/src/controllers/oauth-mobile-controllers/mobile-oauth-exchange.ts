import { Request, Response } from "express";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { createHash, randomUUID } from "crypto";
import { db } from "../../db/db-conn";
import { oauth_identities, tokens, users } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { mobilePendingCodes } from "./mobile-oauth-callback";

function base64UrlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export const mobileOAuthExchange = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { code, code_verifier } = req.body;

  // ═══ Input validation ═══
  if (
    typeof code !== "string" ||
    typeof code_verifier !== "string" ||
    !/^[A-Za-z0-9\-._~]{43,128}$/.test(code_verifier)
  ) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }

  // ═══ ATOMIC CONSUME — delete before any await ═══
  const pending = mobilePendingCodes[code];
  delete mobilePendingCodes[code];

  if (!pending) {
    res.status(400).json({ message: "Invalid or expired code" });
    return;
  }

  if (pending.expiresAt < Date.now()) {
    res.status(400).json({ message: "Code expired" });
    return;
  }

  // ═══ PKCE VERIFICATION ═══
  const expectedChallenge = base64UrlEncode(
    createHash("sha256").update(code_verifier).digest(),
  );

  if (expectedChallenge !== pending.code_challenge) {
    res.status(400).json({ message: "PKCE verification failed" });
    return;
  }

  if (
    !process.env.GOOGLE_MOBILE_REDIRECT_URI ||
    !process.env.GOOGLE_IOS_CLIENT_ID ||
    !process.env.GOOGLE_IOS_CLIENT_SECRET
  ) {
    res.status(500).json({ message: "Server misconfigured" });
    return;
  }

  try {
    // ═══ EXCHANGE GOOGLE CODE WITH VERIFIER ═══
    const mobileOAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_IOS_CLIENT_ID,
      process.env.GOOGLE_IOS_CLIENT_SECRET,
      process.env.GOOGLE_MOBILE_REDIRECT_URI,
    );

    const { tokens: googleTokens } = await mobileOAuth2Client.getToken({
      code: pending.googleCode,
      codeVerifier: code_verifier,
    });
    mobileOAuth2Client.setCredentials(googleTokens);

    // ═══ FETCH GOOGLE PROFILE ═══
    const oauth2 = google.oauth2({
      version: "v2",
      auth: mobileOAuth2Client,
    });
    const { data: profile } = await oauth2.userinfo.get();

    if (!profile.email || !profile.id) {
      res.status(400).json({ message: "Invalid Google profile" });
      return;
    }

    // ═══ REQUIRE VERIFIED EMAIL ═══
    if (profile.verified_email !== true) {
      res.status(403).json({
        message: "Google account email is not verified",
      });
      return;
    }

    if (!process.env.ACCESS_JWT_SECRET || !process.env.REFRESH_JWT_SECRET) {
      throw new Error("JWT secrets not configured");
    }

    const refreshTokenId = randomUUID();

    // ═══ TRANSACTION: resolve user → link identity → issue tokens ═══
    await db.transaction(async (tx) => {
      // ─── Step 1: check existing Google identity ───
      const existingIdentity = await tx
        .select()
        .from(oauth_identities)
        .where(
          and(
            eq(oauth_identities.provider, "google"),
            eq(oauth_identities.providerId, profile.id!),
          ),
        )
        .execute();

      let resolvedUser: { id: number; role: string; username: string };

      if (existingIdentity.length > 0) {
        // Previously linked — this IS the canonical user
        const linkedUser = await tx
          .select()
          .from(users)
          .where(eq(users.id, existingIdentity[0].userId))
          .execute();

        if (linkedUser.length === 0) {
          throw new Error("Linked user not found");
        }

        resolvedUser = linkedUser[0];
      } else {
        // No existing Google identity — check email collision
        const userByEmail = await tx
          .select()
          .from(users)
          .where(eq(users.email, profile.email!))
          .execute();

        if (userByEmail.length > 0) {
          // ═══ FAIL SAFELY ═══
          // Email exists but this Google account was never linked.
          // Do NOT auto-link — this could hand an attacker control
          // of an existing account.
          throw new Error(
            "An account already exists with this email. Please sign in with your original method first, then link Google from account settings.",
          );
        }

        // ─── New user ───
        const newUser = await tx
          .insert(users)
          .values({
            username: profile.name || profile.email!.split("@")[0],
            email: profile.email!,
            password: "oauth_user_no_password",
            role: "user",
          })
          .returning()
          .execute();

        await tx
          .insert(oauth_identities)
          .values({
            provider: "google",
            providerId: profile.id!,
            profilePicture: profile.picture ?? "",
            userId: newUser[0].id,
          })
          .execute();

        resolvedUser = newUser[0];
      }

      // ─── Issue tokens ───
      const accessToken = jwt.sign(
        { id: resolvedUser.id, role: resolvedUser.role },
        process.env.ACCESS_JWT_SECRET as string,
        { expiresIn: "2m" },
      );

      const refreshToken = jwt.sign(
        { id: resolvedUser.id, role: resolvedUser.role, jti: refreshTokenId },
        process.env.REFRESH_JWT_SECRET as string,
        { expiresIn: "5d" },
      );

      await tx.insert(tokens).values({
        userId: resolvedUser.id,
        tokenId: refreshTokenId,
      });

      // ═══ RETURN ALL TOKENS IN BODY — no cookies ═══
      res.json({
        accessToken,
        refreshToken,
        refreshTokenId,
        username: resolvedUser.username,
      });
    });
  } catch (err: any) {
    console.error("[oauth-mobile-exchange] failed:", err);
    res.status(500).json({
      message: err?.message || "Authentication failed",
    });
  }
};

/**
 * 
- Receives { code, code_verifier } in the POST body

- Atomically consumes the code (deletes before any await)

- Verifies PKCE: sha256(code_verifier) matches stored challenge

- Exchanges the Google code with Google (using the verifier)

- Requires verified_email === true

- Identity linking with safety checks (no email-only auto-link)

- Issues access + refresh tokens

- Returns all three in the JSON body


 */
