import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://accounts.google.com https://apis.google.com`,
    `style-src 'self' 'unsafe-inline'`,
    "img-src 'self' data: blob: https://lh3.googleusercontent.com https://github.com",
    "font-src 'self' data:",
    "connect-src 'self' http://localhost:3000 https://api.oocak.com https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com",
    "frame-src https://accounts.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://accounts.google.com",
    "frame-ancestors 'self'",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  // console.log("[CSP middleware] Executed:", request.nextUrl.pathname);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 1. Send CSP to the browser
  response.headers.set("Content-Security-Policy", csp);

  // 2. Send nosniff to the browser
  response.headers.set("X-Content-Type-Options", "nosniff"); // in fact next.config overwrite this so not usefull

  // 3.  Force a Content-Type on the response
  // This will apply to the page, but might also help if the proxy catches the redirection of authentication/authorizations.
  response.headers.set("Content-Type", "text/html; charset=utf-8");
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
