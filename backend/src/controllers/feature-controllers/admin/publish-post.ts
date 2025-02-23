import { Request, Response } from "express";
import { readFileSync, writeFileSync } from "node:fs";
import matter from "gray-matter";
import { db } from "../../../db/db-conn";
import { likes } from "../../../db/schema";

export const publishPost = async (
  req: Request<{ slug: string }>,
  res: Response
): Promise<void> => {
  const { slug } = req.params;

  try {
    // Update the markdown file
    const filePath = `../frontend/src/content/${slug}.md`;
    const fileContent = readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    // Update the published field to true
    const updatedData = { ...data, published: true };

    // Write the updated markdown file
    const updatedFileContent = matter.stringify(content, updatedData);
    writeFileSync(filePath, updatedFileContent, "utf-8");

    // Insert a default row into the likes table
    await db
      .insert(likes)
      .values({ slug, likes_count: 0 })
      .onConflictDoNothing(); // Avoid duplicate entries

    res.status(200).json({ message: `Post ${slug} published successfully` });
  } catch (error) {
    console.error("Error publishing post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
