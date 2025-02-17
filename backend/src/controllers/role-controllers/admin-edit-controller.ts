import { Request, Response } from "express";
import { getUserProfile } from "../../services/getProfile";

export const adminEdit = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const userProfile = await getUserProfile(Number(userId)); // Implement this function to fetch user profile by ID

    if (!userProfile) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ user: userProfile });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Error fetching user profile" });
    }
  }
};
