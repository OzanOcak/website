import { Request, RequestHandler, Response } from "express";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { codeVerifiers } from "./oauth-url";

export const memory: Record<
  string, // userId as a key
  { id: string; email: string; name: string; picture: string }
> = {};

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const oauthCallback: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { code, state, error } = req.query;

  //console.log("code :", code);
  //console.log("state :", state);

  // Check if the user cancelled the OAuth flow
  if (error) {
    // console.log("OAuth flow cancelled by user:", error);
    return res.redirect("http://localhost:5173"); // Redirect to the login page
  }

  // Validate the code and state
  if (typeof code !== "string" || typeof state !== "string") {
    const errorMessage = encodeURIComponent("Invalid code or state");
    return res.redirect(`http://localhost:5173/error?message=${errorMessage}`);
  }

  // Retrieve the code verifier using the state
  const codeVerifier = codeVerifiers[state];

  if (!codeVerifier) {
    const errorMessage = encodeURIComponent("Missing code verifier");
    return res.redirect(`http://localhost:5173/error?message=${errorMessage}`);
  }

  try {
    // 3. Exchange the code for tokens
    const { tokens } = await oauth2Client.getToken({
      code: code,
      codeVerifier: codeVerifier,
    });
    oauth2Client.setCredentials(tokens);
    // 4. Fetch the user's profile from Google
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: profile } = await oauth2.userinfo.get();

    // pass profile id or maybe all profile data with access token to client then send it to ologin

    // 5. Ensure profile.email is a valid string
    if (!profile.email || !profile.id) {
      const errorMessage = encodeURIComponent("Invalid profile data");
      return res.redirect(
        `http://localhost:5173/error?message=${errorMessage}`
      );
    }

    //console.log("profile :", profile);

    memory[profile.id!] = {
      id: profile.id!,
      email: profile.email!,
      name: profile.name!,
      picture: profile.picture!,
    };

    // Generate a short-lived access token
    const accessToken = jwt.sign(
      { id: profile.id }, // Payload
      process.env.ACCESS_JWT_SECRET as string, // Secret key
      { expiresIn: "30s" } // Short expiration time
    );

    // Set the token in a secure, HTTP-only cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: process.env.NODE_ENV !== "development", // Prevent client-side JavaScript access
      secure: true, // Only send over HTTPS
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 30000, // 30 seconds
    });

    // Redirect to the username page with the username as a query parameter
    const redirectUrl = `http://localhost:5173/username?xyz=${encodeURIComponent(
      profile.name!
    )}`;
    res.redirect(redirectUrl);
  } catch (error) {
    // Redirect to an error page or the home page
    const errorRedirectUrl = `http://localhost:5173/error`; // Or any other error page
    res.redirect(errorRedirectUrl);
  }
};
