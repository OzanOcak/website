import { Request, Response } from "express";
import { google } from "googleapis";
import { CodeChallengeMethod } from "google-auth-library";
import { randomBytes } from "crypto";

/**
 * In-memory store for pending OAuth challenges.
 *
 * Keyed by `state`. Holds the PKCE challenge that will later be matched
 * against the code_verifier when the client calls /oauth-mobile/exchange.
 *
 *  In-memory only. A server restart invalidates in-flight flows.
 *    TODO: migrate to Redis or a Postgres table with expiresAt
 *          for multi-instance production deployments.
 */
export const mobilePendingChallenges: Record<
  string,
  { code_challenge: string; expiresAt: number }
> = {};

// Google authorization codes typically expire in ~10 min.
// 5 min is a safe upper bound for our own state TTL.
const CHALLENGE_TTL_MS = 5 * 60 * 1000;

export const getMobileOAuthUrl = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { code_challenge } = req.query;

    // ═══ Accept ONLY the challenge — never the verifier ═══
    if (
      typeof code_challenge !== "string" ||
      !/^[A-Za-z0-9_-]{43}$/.test(code_challenge)
    ) {
      res.status(400).json({ error: "Invalid code challenge" });
      return;
    }

    if (!process.env.GOOGLE_MOBILE_REDIRECT_URI) {
      throw new Error("GOOGLE_MOBILE_REDIRECT_URI is not configured");
    }

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new Error("Google OAuth credentials are not configured");
    }

    // ═══ Generate state ═══
    const state = randomBytes(32).toString("hex");

    // ═══ Clean expired entries ═══
    const now = Date.now();
    for (const key of Object.keys(mobilePendingChallenges)) {
      if (mobilePendingChallenges[key].expiresAt < now) {
        delete mobilePendingChallenges[key];
      }
    }

    // ═══ Store challenge keyed by state ═══
    mobilePendingChallenges[state] = {
      code_challenge,
      expiresAt: now + CHALLENGE_TTL_MS,
    };

    // ═══ Build Google OAuth client with mobile redirect URI ═══
    const mobileOAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_MOBILE_REDIRECT_URI,
    );

    const url = mobileOAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["profile", "email"],
      prompt: "consent",
      state,
      code_challenge,
      code_challenge_method: "S256" as CodeChallengeMethod,
    });

    // ═══ No cookies — mobile client can't receive them ═══
    res.json({ url, state });
  } catch (error) {
    console.error("[mobile-oauth-url] error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
- Accepts only code_challenge from the RN client (never the verifier)

- Generates a state value

- Stores { code_challenge, expiresAt } keyed by state

- Returns the Google OAuth URL + state to the client

- No cookies — mobile client can't receive them
 */
