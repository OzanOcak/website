import fs from "fs";
import matter from "gray-matter";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const filePath = `src/content/${slug}.md`;

  if (!fs.existsSync(filePath)) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return Response.json({
    ...data,
    content, // raw markdown
  });
}
