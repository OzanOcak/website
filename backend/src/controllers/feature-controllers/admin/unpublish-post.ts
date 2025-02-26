import { Request, Response } from "express";
import { readFileSync, writeFileSync } from "node:fs";
import matter from "gray-matter";

export const unpublishPost = async (
  req: Request<{ slug: string }>,
  res: Response
): Promise<void> => {
  const { slug } = req.params;

  try {
    // Update the markdown file
    const filePath = `../frontend/src/content/${slug}.md`;
    const fileContent = readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    // Update the published field to false
    const updatedData = { ...data, published: false };

    // Write the updated markdown file
    const updatedFileContent = matter.stringify(content, updatedData);
    writeFileSync(filePath, updatedFileContent, "utf-8");

    res.status(200).json({ message: `Post ${slug} unpublished successfully` });
  } catch (error) {
    console.error("Error unpublishing post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
