"use client"; // Mark this as a client component

import React, { useState } from "react";
import { parse } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { BlogType } from "@/app/(public)/blog/page";

interface SearchProps {
  blogs: BlogType[];
}

const Search: React.FC<SearchProps> = ({ blogs }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags from the blogs
  const allTags = Array.from(new Set(blogs.flatMap((blog) => blog.tags)));

  // Filter blogs based on search term and selected tags
  const filteredBlogs = blogs
    .filter((blog: BlogType) => blog.published)
    .filter((blog: BlogType) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (blog: BlogType) =>
        selectedTags.length === 0 ||
        selectedTags.some((tag) => blog.tags.includes(tag))
    )
    .sort((a: BlogType, b: BlogType) => {
      const dateA = parse(b.date, "dd.MM.yyyy", new Date()).getTime();
      const dateB = parse(a.date, "dd.MM.yyyy", new Date()).getTime();
      return dateB - dateA; // Sort in descending order (newest first)
    });

  const handleTagChange = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  return (
    <div>
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Tag Filter */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Filter by Tags:</h2>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagChange(tag)}
              className={`px-4 py-2 rounded-full ${
                selectedTags.includes(tag)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Render the filtered BlogList */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog: BlogType, index: number) => (
          <div key={index} className="shadow-lg rounded-lg overflow-hidden">
            <Link href={`/blogpost/${blog.slug}`}>
              <Image
                className="w-full h-64 object-cover object-top transform hover:scale-105"
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

export default Search;
