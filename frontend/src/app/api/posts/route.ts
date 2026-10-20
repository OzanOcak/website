import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function GET() {
  const contentDir = path.join(process.cwd(), "src", "content");

  if (!fs.existsSync(contentDir)) {
    return Response.json(
      { error: "Content directory not found" },
      { status: 500 },
    );
  }

  const files = fs.readdirSync(contentDir);

  const posts = files
    .filter((f) => f.endsWith(".md") && !f.startsWith("."))
    .map((file) => {
      const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
      const { data } = matter(raw);
      const slug = data.slug || file.replace(/\.md$/, "");
      return {
        slug,
        title: data.title ?? "",
        description: data.description ?? "",
        date: data.date ?? "",
        url: `https://oocak.com/blogpost/${slug}`,
      };
    })
    .filter((p) => p.slug);

  return Response.json(posts);
}
