"use client";
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
        className={`h-screen bg-gray-300 dark:bg-black flex mt-[-1rem] items-center justify-center 
        transition-colors duration-500 ${
          isWhiteBackground ? "bg-black" : "bg-gray-300"
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
    <div className="min-h-screen bg-gray-300 dark:bg-black/0 text-white flex items-center justify-center p-8">
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
            <h2 id="the-company" className="text-3xl font-bold mb-6">
              Desktop English Dictionary App
            </h2>
            <p className="text-lg  mb-8">
              Elevate your English vocabulary with our comprehensive Desktop
              English Dictionary App. Tailored for students, professionals, and
              language enthusiasts, this app offers a rich database of the most
              commonly used words, including verbs, nouns, adjectives, adverbs,
              phrasal verbs, and idioms.
            </p>
            <ul>
              <li>
                Elevate your English vocabulary with our comprehensive Desktop
                English Dictionary App. Tailored for students, professionals,
                and language enthusiasts, this app offers a rich database of the
                most commonly used words, including verbs, nouns, adjectives,
                adverbs, phrasal verbs, and idioms.
              </li>
              <li>
                Multiple Selection Exercises: Test your knowledge with engaging
                quizzes that challenge you to identify the correct usage of
                words in context. Track your progress and improve your skills
                over time.
              </li>
              <li>
                Pronunciation Exercises: Master the art of pronunciation with
                audio examples for each word. Listen and repeat to refine your
                accent and fluency.
              </li>
              <li>
                User-Friendly Interface: Navigate effortlessly through a clean,
                intuitive design that allows you to focus on learning without
                distractions.
              </li>
            </ul>
            <i className="font-semibold">( in development...)</i>
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
            Desktop English Dictionary App
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
