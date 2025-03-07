import fs, { readFileSync } from "fs";
import matter from "gray-matter";
import { Metadata } from "next";
import Search from "@/components/ui/search";

export interface BlogType {
  slug: string;
  title: string;
  description: string;
  imageUrl?: string;
  author: string;
  date: string;
  tags: string[];
  published: boolean;
}

let blogs: BlogType[] = [];

try {
  const dirContent = fs.readdirSync("src/content", "utf-8");
  console.log(dirContent);

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

const BlogList = () => {
  return (
    <div className="container mx-auto p-4">
      <Search blogs={blogs} /> {/* Use the Search component here */}
    </div>
  );
};

export const metadata: Metadata = {
  title: "Blogs - ProgrammingWithOzan",
  description:
    "A comprehensive blog for coders of all levels, from beginners to advanced. Explore tutorials, tips, and insights on a wide range of programming languages and technologies. Stay up-to-date with the latest trends in software development, learn best practices, and enhance your coding skills with in-depth articles and guides.",
};

export default BlogList;
