import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string; // Add userId property
    }
  }
}

import "express-session";
import { SessionData } from "express-session";

declare module "express-session" {
  interface SessionData {
    oauthState: string; // Add any other session properties you need
  }
}
