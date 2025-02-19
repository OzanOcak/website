import React from "react";
import fs, { readFileSync } from "fs";
import matter from "gray-matter";
import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";

interface BlogType {
  slug: string;
  title: string;
  description: string;
  imageUrl?: string;
  author: string;
  date: string;
  tags: string[];
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
    };
    return value;
  });
} catch (error) {
  console.error("Error reading content directory:", error);
}

const BlogList = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center my-2"> Apps</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog: BlogType, index: number) => (
          <div key={index} className="shadow-lg rounded-lg overflow-hidden">
            <Link href={`/blogpost/${blog.slug}`}>
              <Image
                className="w-full h-64 object-cover object-top"
                src={blog.imageUrl ? blog.imageUrl : "/images/blogimg.jpg"}
                alt={blog.title}
                width={180}
                height={180}
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                <p className="mb-4">{blog.description}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export const metadata: Metadata = {
  title: "Blogs - Programming",
  description:
    "A comprehensive blog for coders of all levels, from beginners to advanced. Explore tutorials, tips, and insights on a wide range of programming languages and technologies. Stay up-to-date with the latest trends in software development, learn best practices, and enhance your coding skills with in-depth articles and guides.",
};

export default BlogList;
