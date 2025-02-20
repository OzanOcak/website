import { Request, Response } from "express";
import { db } from "../../../db/db-conn";
import { comments } from "../../../db/schema";
import { eq, sql } from "drizzle-orm";

export const likeComment = async (
  req: Request<{ commentId: string }>,
  res: Response
): Promise<void> => {
  const { commentId } = req.params;

  try {
    // Increment the like count for the comment
    const [updatedComment] = await db
      .update(comments)
      .set({ likeCount: sql`${comments.likeCount} + 1` })
      .where(eq(comments.id, Number(commentId)))
      .returning();

    res.status(200).json({ comment: updatedComment });
  } catch (error) {
    console.error("Error liking comment:", error);
    res.status(500).json({ message: "Error liking comment" });
  }
};
