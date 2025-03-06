"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentSecurityPolicy = void 0;
const contentSecurityPolicy = (req, res, next) => {
    res.setHeader("Content-Security-Policy", "script-src 'self' 'nonce-eufDiRfQMZyAOdLwoYQlzw' https://apis.google.com 'unsafe-inline' 'unsafe-eval';");
    next();
};
exports.contentSecurityPolicy = contentSecurityPolicy;
