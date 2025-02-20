import { Request, Response } from "express";
import { sql } from "drizzle-orm";
import { db } from "../../../db/db-conn";
import { likes } from "../../../db/schema";

export const getLikeBlog = async (
  req: Request<{ postId: string }>,
  res: Response
): Promise<void> => {
  const { postId } = req.params; // Extract postId from URL parameters

  if (!postId) {
    res.status(400).json({ message: "Post ID is required" });
    return;
  }

  try {
    // Fetch the likes and dislikes for the post
    const result = await db
      .select({
        likes_count: likes.likes_count,
      })
      .from(likes)
      .where(sql`${likes.slug} = ${postId}`)
      .execute();

    if (result.length === 0) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // Return the likes and dislikes
    res.status(200).json({
      likes: result[0].likes_count,
    });
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
