import { Request, Response, NextFunction } from "express";
import { db } from "../../db/db-conn";
import { eq, sql } from "drizzle-orm";
import { website_visits } from "../../db/schema";

export const getTotalVisit = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await db
      .select()
      .from(website_visits)
      .where(eq(website_visits.id, 1))
      .execute();
    const totalVisits = result[0].total_visits;
    res.json({ total_visits: totalVisits });
  } catch (error) {
    console.error("Error fetching total visits:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
