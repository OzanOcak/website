"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAccessToken = void 0;
const extractAccessToken = (req, res) => {
    let authorizationHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (Array.isArray(authorizationHeader)) {
        // If it's an array, take the first element (usually the case with multiple headers)
        authorizationHeader = authorizationHeader[0];
    }
    const accessToken = authorizationHeader === null || authorizationHeader === void 0 ? void 0 : authorizationHeader.split(" ")[1];
    if (!accessToken) {
        res.status(401).json({ message: "Access token is required" });
        return null;
    }
    //console.log("access token: ", accessToken);
    return accessToken; // Return null to indicate failure
};
exports.extractAccessToken = extractAccessToken;
