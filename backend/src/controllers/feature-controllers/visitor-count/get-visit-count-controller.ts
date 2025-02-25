import { Request, Response } from "express";
import { eq, sql } from "drizzle-orm";
import { db } from "../../../db/db-conn";
import { website_visits } from "../../../db/schema";

// GET /api/visitor-count
export const getVisitorCount = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Fetching visitor count..."); // Debug log

  try {
    const result = await db
      .select()
      .from(website_visits)
      .where(eq(website_visits.id, 1))
      .execute();
    const totalVisits = result[0].total_visits;
    res.status(200).json({ total_visits: totalVisits });
  } catch (error) {
    console.error("Error fetching visitor count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
