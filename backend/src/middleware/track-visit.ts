import { Request, Response, NextFunction } from "express";
import { db } from "../db/db-conn"; // Adjust the path to your Drizzle DB connection
import { website_visits } from "../db/schema"; // Adjust the path to your schema
import { eq, sql } from "drizzle-orm";

export const trackVisit = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check if the "visited" cookie exists
  if (req.cookies.visited) {
    console.log("Cookie exists. Skipping visit tracking."); // Debugging
    return next();
  }
  //console.log(req.cookies.visted);

  // If the cookie does not exist, create it and increment the visit count
  try {
    // Directly increment the visit count in the database
    await db
      .update(website_visits)
      .set({ total_visits: sql`total_visits + 1` })
      .where(eq(website_visits.id, 1))
      .execute();

    // Set a "visited" cookie that expires in 24 hours
    res.cookie("visited", "true", { maxAge: 24 * 60 * 60 * 1000 }); // 24 hours
    console.log("Cookie created and visit tracked."); // Debugging
  } catch (error) {
    console.error("Error tracking visit:", error);
  }

  next();
};
