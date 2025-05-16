"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

// Main page component
const Page = () => {
  const [isWhiteBackground, setIsWhiteBackground] = useState(false);

  // Handle scroll event to toggle background color
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setIsWhiteBackground(true);
      } else {
        setIsWhiteBackground(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {/* Black background section (100vh) */}
      <div
        className={`h-screen bg-gray-200 dark:bg-black flex mt-[-1rem] items-center justify-center 
        transition-colors duration-500 ${
          isWhiteBackground ? "bg-black" : "bg-gray-200"
        }`}
      >
        <BlackScreen />
      </div>
      <div className="flex justify-center">
        <WhiteScreen />
      </div>
    </div>
  );
};

export default Page;

const BlackScreen = () => {
  return (
    <div className="min-h-screen bg-gray-200 dark:bg-black/0 text-white flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Kicker */}
        <div className="text-lg font-semibold text-gray-500 mb-4">
          Master Plan
        </div>

        {/* Heading with Gradient Text */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="text-gray-500 dark:text-white ">
            Discover Your Path to Language Mastery
          </span>
          <span className="text-lg md:text-xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Powered by a passion for learning languages effortlessly.
          </span>
        </h1>

        {/* Meta Info */}
        <div className="flex flex-col md:flex-row gap-4 text-gray-500 mb-8">
          <address className="not-italic">By: O. Ocak</address>
          <time dateTime="2022-05-20T00:00:00.000Z">Feb 27, 2025</time>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-md md:text-lg text-gray-700 dark:text-gray-300 mb-8">
          Background: With a degree in Computer Engineering and over seven years
          of experience in front-end web development, I have cultivated a strong
          foundation in technology and design. My journey in the tech industry
          has equipped me with the skills to create intuitive and user-friendly
          applications. Driven by a desire to develop tools that not only serve
          my personal needs but also benefit others, I am passionate about
          leveraging my expertise to build applications that enhance learning
          and improve everyday experiences. My goal is to create innovative
          solutions that empower individuals to achieve their language mastery
          and beyond.
        </p>

        {/* Gradient Arrow Button 
        <a
          href="/about-us"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 
          to-purple-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          About Us
          <svg
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
          >
            <path
              d="M1 15.4907L14.9814 1.50928M14.9814 1.50928H1M14.9814 1.50928V15.4907"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </a>*/}
      </div>
    </div>
  );
};

const WhiteScreen = () => {
  return (
    <div
      className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-gray-100 
    flex flex-col md:flex-row p-8"
    >
      {/* Main Content - Full width on small screens, 60% width on medium and larger screens */}
      <div className="w-full order-2 md:order-1 md:max-w-4xl">
        {/* Article Content */}
        <article className="rich-text-area">
          {/* The Company */}
          <div className="py-8">
            <h2 id="the-company">
              Welcome to <span className="font-bold">Markle</span>
            </h2>
            {/* Image Section using Next.js Image component */}
            <div className="image-container  p-16">
              <Image
                src="https://github.com/OzanOcak/merkle/blob/main/git-media/markle2.gif?raw=true"
                alt="Markdown Editor Screenshot"
                layout="responsive"
                width={600} // Set the width according to your design
                height={330} // Set the height according to your design
                className="rounded-lg" // Optional: Add any additional classes for styling
              />
            </div>
            <p>
              Unlock your writing potential with Markle, a powerful and
              user-friendly Markdown editor built with Electron. Designed for
              writers, developers, and anyone who loves to create, our editor
              combines the simplicity of Markdown with advanced features to
              enhance your productivity.
            </p>
            <h2>Key Features:</h2>
            <ul>
              <li>
                <strong>VSCode-like Explorer:</strong> Navigate your projects
                effortlessly with an intuitive file explorer that keeps your
                workspace organized.
              </li>
              <li>
                <strong>Export Options:</strong> Seamlessly export your
                documents in multiple formats, including HTML, Markdown, and
                PDF, making it easy to share your work.
              </li>
              <li>
                <strong>LaTeX Support:</strong> Perfect for academics and
                technical writers, our editor supports LaTeX for typesetting
                complex mathematical equations.
              </li>
              <li>
                <strong>Mermaid Integration:</strong> Create beautiful diagrams
                and flowcharts directly within your documents using Mermaid
                syntax.
              </li>
              <li>
                <strong>Code Snippets:</strong> Boost your coding efficiency
                with customizable code snippets that save you time and effort.
              </li>
              <li>
                <strong>User-Friendly UI:</strong> Enjoy a clean and modern
                interface designed for a smooth writing experience, whether you
                are drafting a blog post or coding documentation.
              </li>
              <li>
                <strong>Front Matter Builder:</strong> Easily manage metadata
                with our front matter builder, allowing you to add essential
                information to your Markdown files.
              </li>
              <li>
                <strong>SQLite Support:</strong> Utilize SQLite for efficient
                data storage and management, making it easy to handle your notes
                and documents.
              </li>
            </ul>
            <div className="">
              <h2 className="text-2xl font-bold my-4">Explore the System</h2>
              <p className="">
                You can also read about the system I built in order to develop a
                VSCode-like explorer integrating UI - client and server-side
                states in the link below.
                <a
                  href="https://github.com/OzanOcak/merkle/blob/main/git-media/explorer.md"
                  className="text-sky-500 hover:underline transition duration-200 px-2"
                >
                  Read More
                </a>
              </p>
            </div>
            {/* Button to go to the project */}
            <div className="button-container m-2 px-6 py-1 bg-sky-500 hover:bg-sky-700 rounded-md w-48">
              <Link href="https://github.com/OzanOcak/merkle" passHref>
                <button className="project-button w-full text-center font-extrabold">
                  Go to Project
                </button>
              </Link>
            </div>
          </div>
          {/* The Present */}
          <div className="py-8">
            <h2 id="the-present" className="text-3xl font-bold mb-6">
              Mobile English Dictionary App
            </h2>
            <p className="text-lg mb-8">
              Take your language learning on-the-go with our Mobile English
              Dictionary App, a companion to our desktop version. Designed for
              mobile devices, this app ensures that you have access to essential
              vocabulary resources anywhere, anytime.
            </p>
            <ul>
              <li>
                Seamless Synchronization: Enjoy the convenience of syncing your
                progress between devices. Start learning on your desktop and
                continue effortlessly on your mobile.
              </li>
              <li>
                Interactive Flashcards: Just like the desktop version, our
                mobile app features dynamic flashcards that help reinforce your
                vocabulary skills through quick reviews
              </li>
              <li>
                Intuitive Exercises: Challenge yourself with multiple selection
                exercises, specifically designed for mobile interaction. Stay
                engaged with bite-sized quizzes that fit perfectly into your
                busy schedule.
              </li>
              <li>
                Pronunciation Practice: Hear and practice pronunciations with
                ease. Use the built-in audio features to refine your speaking
                skills, ensuring you are always prepared for real-life
                conversations.
              </li>
            </ul>
            <i className="font-semibold">( in development...)</i>
          </div>
        </article>
      </div>

      {/* Side Navigation - Block on small screens, sidebar on medium and larger screens */}
      <nav className="w-full capitalize font-bold  text-gray-700  dark:text-gray-100  order-1 md:order-2 md:w-64 mb-8 md:mb-0 md:ml-8 md:sticky md:top-8 md:self-start">
        <div className="space-y-2">
          <a
            href="#the-company"
            className="block  hover:text-black dark:hover:text-gray-500"
          >
            Markle Markdown Editor
          </a>
          <a
            href="#the-present"
            className="block hover:text-black dark:hover:text-gray-500"
          >
            Mobile English Dictionary App
          </a>
        </div>
      </nav>
    </div>
  );
};
