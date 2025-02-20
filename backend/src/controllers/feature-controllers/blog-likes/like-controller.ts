import { Request, Response } from "express";
import { sql } from "drizzle-orm";
import { db } from "../../../db/db-conn";
import { likes } from "../../../db/schema";

export const likeBlog = async (
  req: Request<{ postId: string }>,
  res: Response
): Promise<void> => {
  const { postId } = req.params; // Extract postId from URL parameters

  if (!postId) {
    res.status(400).json({ message: "Post ID is required" });
    return;
  }

  try {
    // Increment the likes_count for the post
    await db
      .update(likes)
      .set({ likes_count: sql`${likes.likes_count} + 1` })
      .where(sql`${likes.slug} = ${postId}`)
      .execute();

    res.status(201).json({ message: "Post liked successfully" });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
