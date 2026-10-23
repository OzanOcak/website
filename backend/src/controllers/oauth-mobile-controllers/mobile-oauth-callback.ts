import { Request, RequestHandler, Response } from "express";
import { randomUUID } from "crypto";
import { mobilePendingChallenges } from "./mobile-oauth-url";

/**
 * In-memory store for single-use authorization codes.
 *
 * Keyed by `appCode` (UUID). Holds the Google authorization code + the PKCE
 * challenge so /exchange can complete the flow.
 *
 *  In-memory only. A server restart invalidates in-flight flows.
 *    TODO: migrate to Redis or a Postgres table with expiresAt
 *          for multi-instance production deployments.
 */
export const mobilePendingCodes: Record<
  string,
  {
    googleCode: string;
    code_challenge: string;
    expiresAt: number;
  }
> = {};

// Client must redeem the code within 60 seconds
const CODE_TTL_MS = 60 * 1000;

export const mobileOAuthCallback: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { code, state, error } = req.query;

  // ═══ State must be present ═══
  if (typeof state !== "string") {
    return res.redirect(
      "oocakrn://oauth-callback?success=false&reason=no_state",
    );
  }

  // ═══ Validate + consume state (single use) ═══
  const pending = mobilePendingChallenges[state];
  delete mobilePendingChallenges[state];

  if (!pending || pending.expiresAt < Date.now()) {
    return res.redirect(
      "oocakrn://oauth-callback?success=false&reason=invalid_state",
    );
  }

  // ═══ User cancelled at Google ═══
  if (error) {
    return res.redirect(
      "oocakrn://oauth-callback?success=false&reason=cancelled",
    );
  }

  // ═══ Google code must be present ═══
  if (typeof code !== "string") {
    return res.redirect(
      "oocakrn://oauth-callback?success=false&reason=no_google_code",
    );
  }

  // ═══ Clean expired codes ═══
  const now = Date.now();
  for (const key of Object.keys(mobilePendingCodes)) {
    if (mobilePendingCodes[key].expiresAt < now) {
      delete mobilePendingCodes[key];
    }
  }

  // ═══ Create single-use appCode ═══
  const appCode = randomUUID();

  mobilePendingCodes[appCode] = {
    googleCode: code,
    code_challenge: pending.code_challenge,
    expiresAt: now + CODE_TTL_MS,
  };

  // ═══ Redirect to deep link with ONLY the code ═══
  return res.redirect(
    `oocakrn://oauth-callback?success=true&code=${encodeURIComponent(appCode)}`,
  );
};

/**
- Validates state against mobilePendingChallenges (consumes it — single use)

- Does NOT call Google (that happens in /exchange)

- Creates a single-use appCode (UUID)

- Stores { googleCode, code_challenge, expiresAt } keyed by appCode

- Redirects to oocakrn://oauth-callback?success=true&code=APP_CODE

- On any error, redirects to deep link with success=false&reason=...
 */
