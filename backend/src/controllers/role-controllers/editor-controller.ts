import { Request, Response } from "express";
import { getAllUsers } from "../../services/getAllUser";

export const editor = async (req: Request, res: Response): Promise<void> => {
  try {
    //const allUsers = await getAllUsers(); // Fetch all users
    res.status(200).json({
      users: "something from editor", // front-end response.data.users
      //  profile: profile,
    });
    //console.log("Fetched users:", allUsers);
  } catch (error) {
    console.error("Error fetching editor data:", error);
    if (!res.headersSent) {
      // Check if headers have already been sent
      res.status(500).json({ message: "Error fetching data" });
    }
  }
};
