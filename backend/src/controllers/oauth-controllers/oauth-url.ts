import { NextFunction, Request, Response } from "express";
import { google } from "googleapis";
import { CodeChallengeMethod } from "google-auth-library";

// Temporary storage for code verifiers (in-memory)
export const codeVerifiers: Record<string, string> = {};

export const getGoogleOAuthUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code_challenge, code_verifier } = req.query; // Get the code challenge from the client
    // console.log("Session:", req.session); // Debug log

    // Validate the code challenge and code verifier
    if (
      typeof code_challenge !== "string" ||
      typeof code_verifier !== "string"
    ) {
      res
        .status(400)
        .json({ error: "Invalid code challenge or code verifier" });
      return;
    }

    // Log environment variables
    console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
    console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET);
    console.log("Google Redirect URI:", process.env.GOOGLE_REDIRECT_URI);

    // create an instance of OAuth2Client using the google.auth.OAuth2 constructor,
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    console.log(process.env.GOOGLE_REDIRECT_URI);

    // generates the URL to which the user will be redirected to grant permission.
    const state = "some_random_state_string";
    //(req.session as any).oauthState = state;

    // Store the code verifier linked to the state
    codeVerifiers[state] = code_verifier;

    console.log("State for CSRF protection:", state);

    // use the generateAuthUrl method to generate the authentication URL
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline", // Requests a refresh token in addition to an access token.
      scope: ["profile", "email"], // Requests access to the user’s profile and email.
      prompt: "consent", // Ensures the user is prompted to grant permission, even if they’ve already done so.
      state: state, // later use it for CSRF
      code_challenge: code_challenge as string, // Use the provided code challenge
      code_challenge_method: "S256" as CodeChallengeMethod, // Use SHA-256
    });

    // cast the req object to any to avoid the TypeScript error
    // (req as { googleOauthUrl?: string }).googleOauthUrl = url;
    console.log("Generated Google OAuth URL:", url);

    res.json({ url, state });
    //  next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
