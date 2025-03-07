import fs from "fs";
import matter from "gray-matter";
import { readFileSync } from "fs";
import BlogPostTable from "@/components/custom/admin/blogTable";
import Layout from "@/components/custom/layout";
import { BlogType } from "@/app/(public)/blog/page";

export default function ArticlesPage() {
  let blogs: BlogType[] = [];

  try {
    const dirContent = fs.readdirSync("src/content", "utf-8");
    //console.log(dirContent);

    blogs = dirContent.map((file) => {
      const fileContent = readFileSync(`src/content/${file}`, "utf-8");
      const { data } = matter(fileContent);
      const value: BlogType = {
        slug: data.slug || "",
        title: data.title || "",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        author: data.author || "",
        date: data.date || "",
        tags: data.tags || "",
        published: data.published || false,
      };
      return value;
    });
  } catch (error) {
    console.error("Error reading content directory:", error);
  }

  return (
    <Layout>
      <div className="mt-4 w-full">
        <h2 className="text-2xl font-bold mb-2">List of All Articles:</h2>
        <BlogPostTable blogs={blogs} />
      </div>
    </Layout>
  );
}
