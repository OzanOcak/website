import { Request, Response } from "express";
import { db } from "../../../db/db-conn";
import { comments } from "../../../db/schema";
import { eq } from "drizzle-orm"; // Import eq from drizzle-orm

export const editComment = async (
  req: Request<{ commentId: string }>,
  res: Response
): Promise<void> => {
  const { commentId } = req.params;
  const { content } = req.body; // Assuming content is sent in the request body

  try {
    // Update the comment in the database using the commentId
    const result = await db
      .update(comments)
      .set({ content })
      .where(eq(comments.id, Number(commentId))); // Use eq to match the commentId

    if (result.rowCount !== null && result.rowCount > 0) {
      res.status(200).json({ message: "Comment updated successfully" });
    } else {
      res.status(404).json({ message: "Comment not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating comment", error });
  }
};
