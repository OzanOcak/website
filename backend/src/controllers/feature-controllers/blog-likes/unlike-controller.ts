import { Request, Response } from "express";
import { sql } from "drizzle-orm";
import { db } from "../../../db/db-conn";
import { likes } from "../../../db/schema";

export const dislikeBlog = async (
  req: Request<{ postId: string }>,
  res: Response
): Promise<void> => {
  const { postId } = req.params; // Get the slug from the query parameters
  console.log("postId", postId);

  if (!postId) {
    res.status(400).json({ message: "Slug is required" });
    return;
  }

  try {
    // Increment the dislikes_count for the post
    await db
      .update(likes)
      .set({ likes_count: sql`${likes.likes_count} - 1` })
      .where(sql`${likes.slug} = ${postId}`)
      .execute();

    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
