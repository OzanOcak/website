import { Router } from "express";
import { db } from "../db/db-conn"; // Adjust the path as needed
import { website_visits } from "../db/schema"; // Adjust the path as needed
import { eq } from "drizzle-orm";

const router = Router();

// Endpoint to fetch the total visits
router.get("/admin/total-visits", async (req, res) => {
  try {
    const result = await db
      .select()
      .from(website_visits)
      .where(eq(website_visits.id, 1))
      .execute();
    const totalVisits = result[0].total_visits;
    res.status(200).json({ total_visits: totalVisits });
  } catch (error) {
    console.error("Error fetching total visits:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
