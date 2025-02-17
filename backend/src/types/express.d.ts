// types/express.d.ts
import "express-session";

declare module "express-session" {
  interface SessionData {
    oauthState: string; // Add any other session properties you need
  }
}
