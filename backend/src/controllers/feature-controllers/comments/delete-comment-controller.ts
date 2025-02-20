import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../../../db/db-conn";
import { comments } from "../../../db/schema";

export const deleteCommentById = async (
  req: Request<{ commentId: string }>,
  res: Response
): Promise<void> => {
  const { commentId } = req.params;

  try {
    // Check if the comment exists
    const comment = await db
      .select()
      .from(comments)
      .where(eq(comments.id, Number(commentId)))
      .execute();

    if (comment.length === 0) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    const foundComment = comment[0]; // Get the first comment object

    // Delete the comment
    await db
      .delete(comments)
      .where(eq(comments.id, Number(commentId)))
      .execute();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Error deleting comment" });
  }
};
