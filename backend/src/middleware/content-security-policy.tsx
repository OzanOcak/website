import { Request, Response, NextFunction } from "express";

export const contentSecurityPolicy = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' 'nonce-eufDiRfQMZyAOdLwoYQlzw' https://apis.google.com 'unsafe-inline' 'unsafe-eval';"
  );
  next();
};
