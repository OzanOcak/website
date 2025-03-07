import { Request, Response } from "express";
import { db } from "../../../db/db-conn";
import { eq, sql } from "drizzle-orm";
import { comments } from "../../../db/schema";
export const getCommentCountByBlogId = async (
  req: Request<{ postId: string }>,
  res: Response
): Promise<void> => {
  const { postId } = req.params;

  if (!postId) {
    res.status(400).json({ message: "Post ID is required" });
    return;
  }

  try {
    const result = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(comments)
      .where(eq(comments.blogId, postId))
      .execute();

    res.status(200).json({ count: result[0].count });
  } catch (error) {
    console.error("Error fetching comment count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
