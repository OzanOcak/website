import { Request, Response, NextFunction } from "express";

export const extractAccessToken = (req: Request, res: Response) => {
  let authorizationHeader =
    req.headers["authorization"] || req.headers["Authorization"];

  if (Array.isArray(authorizationHeader)) {
    // If it's an array, take the first element (usually the case with multiple headers)
    authorizationHeader = authorizationHeader[0];
  }

  const accessToken = authorizationHeader?.split(" ")[1];

  if (!accessToken) {
    res.status(401).json({ message: "Access token is required" });
    return null;
  }
  //console.log("access token: ", accessToken);

  return accessToken; // Return null to indicate failure
};
