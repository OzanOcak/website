import { RequestHandler } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { db } from "../../../db/db-conn";
import { deviceKeys, users, tokens } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { pendingChallenges } from "./enclave-challenge";

export const verifyEnclaveSignature: RequestHandler = async (req, res) => {
  const { deviceId, challenge, signature } = req.body;

  if (!deviceId || !challenge || !signature) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  // 1. Check if challenge exists and hasn't expired
  const pending = pendingChallenges[challenge];
  if (!pending || pending.expiresAt < Date.now()) {
    res.status(400).json({ message: "Challenge expired or invalid" });
    return;
  }

  // 2. Consume the challenge immediately (Single-use)
  delete pendingChallenges[challenge];

  // 3. Make sure the challenge belongs to this device
  if (pending.deviceId !== deviceId) {
    res.status(403).json({ message: "Challenge does not match device" });
    return;
  }

  try {
    // 4. Get the public key from the database
    const deviceRecord = await db
      .select()
      .from(deviceKeys)
      .where(eq(deviceKeys.deviceId, deviceId))
      .execute();

    if (deviceRecord.length === 0) {
      res.status(404).json({ message: "Device not found" });
      return;
    }

    const publicKeyBase64 = deviceRecord[0].publicKey;
    const userId = deviceRecord[0].userId;

    // ═══ FIX: Wrap raw key in SPKI header ═══
    const rawPublicKey = Buffer.from(publicKeyBase64, "base64");
    const spkiHeader = Buffer.from(
      "3059301306072a8648ce3d020106082a8648ce3d030107034200",
      "hex",
    );
    const spkiPublicKey = Buffer.concat([spkiHeader, rawPublicKey]);

    // 5. Verify the signature using Node's crypto module
    // The Secure Enclave signs the raw string bytes using ECDSA-SHA256
    const verifier = crypto.createVerify("SHA256");
    verifier.update(challenge);

    const isValid = verifier.verify(
      {
        key: spkiPublicKey,
        format: "der",
        type: "spki", // The format Secure Enclave exports
      },
      Buffer.from(signature, "base64"),
    );

    if (!isValid) {
      res.status(401).json({ message: "Invalid signature" });
      return;
    }

    // 6. Signature is valid! Issue session tokens (Just like your email login)
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .execute();
    if (user.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const refreshTokenId = randomUUID();
    const accessToken = jwt.sign(
      { id: user[0].id, role: user[0].role },
      process.env.ACCESS_JWT_SECRET!,
      { expiresIn: "2m" },
    );
    const refreshToken = jwt.sign(
      { id: user[0].id, role: user[0].role, jti: refreshTokenId },
      process.env.REFRESH_JWT_SECRET!,
      { expiresIn: "5d" },
    );

    await db.insert(tokens).values({
      userId: user[0].id,
      tokenId: refreshTokenId,
    });

    res.json({
      accessToken,
      refreshToken,
      refreshTokenId,
      username: user[0].username,
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};
