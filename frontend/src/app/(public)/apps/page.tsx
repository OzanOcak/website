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
        <div className="text-lg font-semibold text-gray-500 ">Master Plan</div>

        {/* Heading with Gradient Text */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 mt-12 sm:mt-0">
          <span className="text-gray-500 dark:text-white ">
            Discover Your Path to Language Mastery
          </span>
          <span className="text-lg md:text-xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Powered by a passion for developing apps effortlessly.
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
            <h2 id="markle">
              Welcome to <span className="font-bold">Markle</span>
            </h2>
            {/* Image Section using Next.js Image component */}
            <div className="image-container p-0 md:p-4 lg:p-16 mb-4">
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
            <h2 className="my-2">Key Features:</h2>
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
          {/* The Company */}
          <div className="py-8">
            <h2 id="auth">Authentication & Authorization</h2>
            {/* Image Section using Next.js Image component */}
            <div className="image-container p-0 md:p-4 lg:p-16 mb-4">
              <Image
                src="https://github.com/OzanOcak/merkle/blob/main/git-media/auth.gif?raw=true"
                alt="Markdown Editor Screenshot"
                layout="responsive"
                width={600} // Set the width according to your design
                height={330} // Set the height according to your design
                className="rounded-lg" // Optional: Add any additional classes for styling
              />
            </div>
            <p>
              AuthFlow is a robust, self-contained authentication and
              authorization system designed to handle modern security challenges
              without relying on third-party libraries (except NodeMailer for
              OTP delivery). Built from scratch with OWASP best practices, it
              offers a modular, scalable solution for apps requiring
              fine-grained user access control, multi-factor authentication
              (MFA), and token-based security.
            </p>
            <h2 className="mt-4">Key Features:</h2>
            <h3>🔒 End-to-End JWT Security</h3>
            <ul>
              <li>
                Stateless authentication using access/refresh tokens with token
                invalidation (token IDs).
              </li>
              <li>
                Secure cookie handling and session management for server-side
                validation.
              </li>
              <li>
                Axios interceptor integration for seamless token renewal and
                request retries.
              </li>
            </ul>
            <h3 className="mt-4">🛡 Multi-Layered Authentication</h3>
            <ul>
              <li>OAuth2-style flows for third-party integrations.</li>
              <li>
                <strong>Code Snippets:</strong> Boost your coding efficiency
                with customizable code snippets that save you time and effort.
              </li>
              <li>Time-based OTP (TOTP) and email-based 2FA.</li>
              <li>
                Customizable password policies and brute-force protection.
              </li>
            </ul>
            <h3 className="mt-4">🔑 User-Centric Authorization</h3>
            <ul>
              <li>
                Role and permission management inspired by OAuth’s scope logic,
                enabling granular access control (e.g., user:read, admin:write).
              </li>
              <li>
                Lightweight, library-free implementation for full transparency
                and control.
              </li>
            </ul>
            <h3 className="mt-4">⚡ Modern Tech Stack</h3>
            <ul>
              <li>
                Frontend: React + TypeScript, React Query for state management,
                Zod for schema validation.
              </li>
              <li>
                Backend: Express.js with Node.js, Drizzle ORM, PostgreSQL.
                TypeScript throughout for type safety.
              </li>
              <li>
                DevOps-ready: Containerized deployment with Docker; easily
                integrates into REST/gRPC APIs.{" "}
              </li>
            </ul>
            <div className="">
              <h2 className="text-2xl font-bold my-4">Explore the System</h2>
              <p className="">
                You can read about the website I built in order to self host api
                and tunnel it via Clouflare and make it publicly available to
                frontend is hosted by Vercel
                <a
                  href="https://github.com/OzanOcak/merkle/blob/main/git-media/architecture.md"
                  className="text-sky-500 hover:underline transition duration-200 px-2"
                >
                  Read More
                </a>
              </p>
              <p className="">
                You can also read the article about the achitecture of my
                website.
                <a
                  href="http://localhost:5173/blogpost/raspberry-pi-cloudflare-vercel-architecture"
                  className="text-sky-500 hover:underline transition duration-200 px-2"
                >
                  Read More
                </a>
              </p>
            </div>
          </div>
          {/* The Present */}
          <div className="py-8">
            <h2 id="makeitenglish" className="text-3xl font-bold mb-6">
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
            <div className="button-container m-2 px-6 py-1 bg-sky-500 hover:bg-sky-700 rounded-md w-48">
              <Link href="https://oocak.com/apps/smartwords" passHref>
                <button className="project-button w-full text-center font-extrabold">
                  Go to SmartWords&apos;s Page
                </button>
              </Link>
            </div>
          </div>
        </article>
      </div>

      {/* Side Navigation - Block on small screens, sidebar on medium and larger screens */}
      <nav className="w-full capitalize font-bold  text-gray-700  dark:text-gray-100  order-1 md:order-2 md:w-64 mb-8 md:mb-0 md:ml-8 md:sticky md:top-8 md:self-start">
        <div className="space-y-2">
          <a
            href="#markle"
            className="block  hover:text-black dark:hover:text-gray-500"
          >
            Markle Markdown Editor
          </a>
          <a
            href="#auth"
            className="block  hover:text-black dark:hover:text-gray-500"
          >
            Authentication and Authorization System
          </a>
          <a
            href="#makeitenglish"
            className="block hover:text-black dark:hover:text-gray-500"
          >
            Mobile English Dictionary App
          </a>
        </div>
      </nav>
    </div>
  );
};
