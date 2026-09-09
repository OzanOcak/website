"use client"; // Mark this as a client component

import React, { useState } from "react";
import { parse } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { BlogType } from "@/app/(public)/blog/page";

interface SearchProps {
  blogs: BlogType[];
}

const SearchedPosts: React.FC<SearchProps> = ({ blogs }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagFilterOpen, setIsTagFilterOpen] = useState(false);

  // Get all unique tags from the blogs
  const allTags = Array.from(new Set(blogs.flatMap((blog) => blog.tags)));

  // Filter blogs based on search term and selected tags
  const filteredBlogs = blogs
    .filter((blog: BlogType) => blog.published)
    .filter((blog: BlogType) =>
      `${blog.title} ${blog.tags.join(" ")}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    )
    .filter(
      (blog: BlogType) =>
        selectedTags.length === 0 ||
        selectedTags.some((tag) => blog.tags.includes(tag)),
    )
    .sort((a: BlogType, b: BlogType) => {
      const dateA = parse(b.date, "dd.MM.yyyy", new Date()).getTime();
      const dateB = parse(a.date, "dd.MM.yyyy", new Date()).getTime();
      return dateA - dateB; // Sort in descending order (newest first)
    });

  const handleTagChange = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag],
    );
  };

  const toggleTagFilter = () => {
    setIsTagFilterOpen((prev) => !prev);
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

      {/* Tag Filter Accordion */}
      <div className="mb-6">
        <button
          onClick={toggleTagFilter}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault(); // Prevent scrolling on Space key
              toggleTagFilter();
            }
          }}
          aria-expanded={isTagFilterOpen}
          aria-controls="tag-filter-content"
          className="text-xl font-semibold mb-2 cursor-pointer focus:outline-none "
        >
          Filter by Tags {isTagFilterOpen ? "▲" : "▼"}
        </button>

        {/* use div tag instead isTagFilterOpen? for smoothness */}
        <div
          id="tag-filter-content"
          role="region"
          aria-hidden={!isTagFilterOpen}
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isTagFilterOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
          }`}
        >
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
      </div>

      {/* Render the filtered BlogList */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog: BlogType, index: number) => (
          <div key={index} className="shadow-lg rounded-lg overflow-hidden">
            <Link href={`/blogpost/${blog.slug}`}>
              <Image
                className="w-full h-64 object-cover object-top transform hover:scale-105"
                src={blog.imageUrl ? blog.imageUrl : "/images/1.webp"}
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

export default SearchedPosts;
