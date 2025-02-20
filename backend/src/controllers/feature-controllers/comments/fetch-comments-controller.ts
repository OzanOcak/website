import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { comments, oauth_identities, users } from "../../../db/schema";
import { db } from "../../../db/db-conn";

export const getCommentsByBlogId = async (
  req: Request<{ postId: string }>,
  res: Response
): Promise<void> => {
  const { postId } = req.params;

  try {
    // Fetch comments for the blog post
    const commentsList = await db
      .select({
        id: comments.id,
        content: comments.content,
        userId: comments.userId,
        likeCount: comments.likeCount,
        createdAt: comments.createdAt,
        username: users.username,
        profilePicture: oauth_identities.profilePicture,
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .leftJoin(oauth_identities, eq(users.id, oauth_identities.userId))
      .where(eq(comments.blogId, postId))
      .execute();

    res.status(200).json({ comments: commentsList });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments" });
  }
};
