import { Request, Response } from "express";
import { getAllUsers } from "../../services/getAllUser";
import { countUsers } from "../../services/countUsers";

export const admin = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      searchQuery = "",
      searchCriteria = "name",
    } = req.query; // Destructure page and limit from query parameters

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    // Validate page and limit to ensure they are positive numbers
    if (
      isNaN(pageNumber) ||
      isNaN(limitNumber) ||
      pageNumber < 1 ||
      limitNumber < 1
    ) {
      res.status(400).json({ message: "Invalid page or limit value" });
      return;
    }
    const allUsers = await getAllUsers(
      pageNumber,
      limitNumber,
      searchQuery as string,
      searchCriteria as string
    );
    const totalUsers = await countUsers(
      searchQuery as string,
      searchCriteria as string
    ); // Get the total number of users

    // const profile = await getUserProfile(req, res); // this sends res too, admin also sends res. multiple headers res error.
    // Check if the returned data is an array and matches the User type
    if (!Array.isArray(allUsers)) {
      throw new Error("Unexpected data format: Not an array");
    }
    res.status(200).json({ users: allUsers, total: totalUsers });
  } catch (error) {
    console.error("Error fetching editor data:", error);
    if (!res.headersSent) {
      // Check if headers have already been sent
      res.status(500).json({ message: "Error fetching data" });
    }
  }
};
