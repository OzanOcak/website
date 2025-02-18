import { Request, Response } from "express";
import { likes } from "../../db/schema";
import { sql } from "drizzle-orm";
import { db } from "../../db/db-conn";

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
