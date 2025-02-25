import { Request, Response } from "express";
import { eq, sql } from "drizzle-orm";
import { db } from "../../../db/db-conn";
import { website_visits } from "../../../db/schema";

// GET /api/visitor-count
export const increaseVisitorCount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await db
      .update(website_visits)
      .set({ total_visits: sql`total_visits + 1` })
      .where(eq(website_visits.id, 1))
      .execute();
    res.status(200).json({ message: "Visitor count increased successfully" });
  } catch (error) {
    console.error("Error increasing visitor count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
