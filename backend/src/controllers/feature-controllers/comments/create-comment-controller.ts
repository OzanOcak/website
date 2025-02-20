import { Request, Response } from "express";
import { db } from "../../../db/db-conn";
import { comments } from "../../../db/schema";

export const createComment = async (
  req: Request<{ postId: string }, {}, { content: string; userId: number }>,
  res: Response
): Promise<void> => {
  const { postId } = req.params;
  const { content, userId } = req.body;

  try {
    // Insert the comment into the database
    const [newComment] = await db
      .insert(comments)
      .values({
        content,
        userId,
        blogId: postId,
        likeCount: 0, // Default like count
      })
      .returning();

    res.status(201).json({ comment: newComment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Error creating comment" });
  }
};
