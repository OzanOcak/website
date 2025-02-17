import { Request, Response } from "express";
import { deleteProfile } from "../../services/deleteProfile";

export const deleteUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params; // Get the user ID from the request params
  const id = Number(userId);

  try {
    await deleteProfile(id); // Call the service function

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    // Use type assertion to treat error as an Error object
    const typedError = error as Error;

    if (typedError.message === "User not found") {
      res.status(404).json({ message: "User not found" });
    } else {
      console.error("Error deleting user:", typedError);
      res.status(500).json({ message: "Error deleting user" });
    }
  }
};
