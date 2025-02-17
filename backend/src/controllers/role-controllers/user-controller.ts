import { Request, Response } from "express";
import { getUserProfile } from "../../services/getProfile";

export const user = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.userId); // Extract userId from the request
    const profile = await getUserProfile(userId); // Call the service function

    // Ensure that the profile retrieval was successful and check for undefined.
    if (!profile) {
      res.status(404).json({ message: "Profile not found." });
      return;
    }

    res.status(200).json({ profile: profile }); // Return to prevent further execution
    return;
  } catch (error) {
    console.error("Error fetching editor data:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Error fetching data" });
      return;
    }
    // If headers were already sent, you can log this or handle it as needed
  }
};
