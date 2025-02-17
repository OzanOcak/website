// Helper function to generate a random string
const generateRandomString = (length: number): string => {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => charset[byte % charset.length]).join("");
};

// Generate a code verifier
export const generateCodeVerifier = (): string => {
  // console.log(generateRandomString(64));

  return generateRandomString(64); // 64 characters long
};

// Generate a code challenge from the code verifier
export const generateCodeChallenge = async (
  codeVerifier: string
): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier); // Convert the code verifier to a Uint8Array
  const hash = await window.crypto.subtle.digest("SHA-256", data); // Hash the code verifier

  // Convert the hash to a Base64 URL-encoded string
  const base64 = btoa(String.fromCharCode(...new Uint8Array(hash))); // Convert hash to Base64
  const base64Url = base64
    .replace(/\+/g, "-") // Replace + with -
    .replace(/\//g, "_") // Replace / with _
    .replace(/=+$/, ""); // Remove padding

  return base64Url;
};
/*
TEST :
(async () => {
  const codeVerifier = generateCodeVerifier();
  console.log("Code Verifier:", codeVerifier);

  const codeChallenge = await generateCodeChallenge(codeVerifier);
  console.log("Code Challenge:", codeChallenge);

  // Verify the code challenge is Base64 URL-encoded
  const isValid = /^[A-Za-z0-9\-_]+$/.test(codeChallenge);
  console.log("Is Code Challenge Valid?", isValid);
})();


* Neither cypto or base64url is availabe in browser (only available in node)

import crypto from "crypto";
import base64url from "base64url";

// Helper function to generate a random string
const generateRandomString = (length: number): string => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
};

// Generate a code verifier
export const generateCodeVerifier = (): string => {
  return generateRandomString(64); // 64 characters long
};

// Generate a code challenge from the code verifier
export const generateCodeChallenge = (codeVerifier: string): string => {
  const hash = crypto.createHash("sha256").update(codeVerifier).digest();
  return base64url.encode(hash);
};


------------------------------------------------------------------

PKCE

PKCE adds an extra layer of security by ensuring that only the client thatinitiated the
authorization request can exchange the authorization code for tokens. This is especially
important for public clients (e.g., SPAs, mobile apps) that cannot securely store client
secrets. 

Client-Side flow :
1- Generate the code verifier and code challenge on the client side. - (utils/pkce.ts)
2- Pass the code challenge to the backend when initiating the OAuth
flow. - (components/oauth/useGoogleSignInUrl.ts)
3- Store the code verifier securely (in session storage). - (oauth/useGoogleSignInUrl.ts)
4- Pass the code verifier to the backend during the token exchange. - (/oauth/useGoogleSignInUrl.ts) 

Server-Side flow :

5- getGoogleOAuthUrl.ts should accept the code challenge and include it in the 
authorization URL. - (/oauth-controllers/oauth-url/)
6- Retrieve the code verifier from session storage and send it to the backend.
- (/oauth-controllers/oauth-callback/)
*/
