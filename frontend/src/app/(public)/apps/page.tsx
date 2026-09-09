"use client";
import { ProjectCard } from "@/components/custom/projects/ProjectCard";
import { useCallback, useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

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
  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);
  return (
    <div className="relative min-h-screen bg-gray-200 dark:bg-black/0 text-white flex items-center justify-center p-8">
      {/* Particles - Only inside this section */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fullScreen: {
              enable: false, // THIS IS THE KEY
            },
            background: {
              color: { value: "transparent" },
            },
            fpsLimit: 60,
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
              },
            },
            particles: {
              color: { value: "#a855f7" },
              links: {
                color: "#3b82f6",
                distance: 150,
                enable: true,
                opacity: 0.2,
                width: 1,
              },
              move: {
                enable: true,
                speed: 1.5,
                direction: "none",
                random: false,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 60,
              },
              opacity: {
                value: 0.4,
              },
              size: {
                value: { min: 1, max: 3 },
              },
            },
            detectRetina: true,
          }}
          className="w-full h-full"
        />
      </div>

      <div className="max-w-4xl w-full">
        {/* Kicker */}
        <div className="text-lg font-semibold text-gray-500">Featured Work</div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 mt-12 sm:mt-0">
          <span className="text-gray-900 dark:text-white">
            Apps I've Built,
          </span>
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Shipped & Open-Sourced
          </span>
        </h1>

        {/* Meta Info */}
        <div className="flex flex-col md:flex-row gap-4 text-gray-500 mb-8">
          <address className="not-italic">By: O. Ocak</address>
          <time dateTime="2022-05-20T00:00:00.000Z">Feb 27, 2025</time>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-md md:text-lg text-gray-700 dark:text-gray-300 mb-8">
          I'm a front-end engineer who actually ships. Over the last 8 years,
          I've built production apps across iOS, desktop, and web — with a focus
          on offline-first architecture, React, React Native, Rust performance,
          and clean UI. This page is a living catalog of everything I've built,
          learned, and open-sourced.
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
      className="min-h-screen bg-white text-black dark:bg-black dark:text-gray-100 
    flex flex-col md:flex-row p-8"
    >
      {/* Main Content - Full width on small screens, 60% width on medium and larger screens */}
      <div className="w-full order-2 md:order-1 md:max-w-4xl">
        {/* Article Content */}
        <article className="rich-text-area">
          <div
            id="smart_words_dictionary"
            className="py-8 border-t border-slate-200 dark:border-slate-800"
          >
            <ProjectCard
              title="Smart Words Dictionary"
              desc="Offline-first vocabulary engine featuring 30,000+ words, spaced-repetition memory tracking, and exam practice modules."
              tag="iOS & Mobile"
              icon="/app-icons/smart_words.webp"
              metrics="30k+ Words • 200k Questions"
              path="/apps/smartwords"
              color="blue"
            />
          </div>
          <div
            id="go_french"
            className="py-8 border-t border-slate-200 dark:border-slate-800"
          >
            <ProjectCard
              title="Go French"
              desc="Interactive language acquisition suite focused on real-world conversational patterns, grammar drills, and spaced recall."
              tag="iOS & Mobile"
              icon="/app-icons/gofrench.webp"
              metrics="Grammar • Active Recall"
              path="/apps/gofrench"
              color="amber"
            />
          </div>

          <div
            id="frontend_pro"
            className="py-8 border-t border-slate-200 dark:border-slate-800"
          >
            <ProjectCard
              title="Frontend Pro"
              desc="Targeted technical interview practice engine and interactive quizzes for modern web developers."
              tag="iOS & Mobile"
              icon="/app-icons/frontend_pro.webp"
              metrics="React • TypeScript • Web Architecture"
              path="/apps/frontendpro"
              color="green"
            />
          </div>
          <div
            id="pixel_shrink"
            className="py-8 border-t border-slate-200 dark:border-slate-800"
          >
            <ProjectCard
              title="PixelShrink"
              desc="Visually lossless image compression with metadata purging and high-ratio quantization. Built with Rust and Tauri."
              tag="Desktop App"
              icon="/app-icons/pixel_shrink.webp"
              metrics="Rust • Tauri • 80x Compression"
              path="/apps/pixelshrink"
              color="purple"
            />
          </div>

          <div
            id="mac_cleaner"
            className="py-8 border-t border-slate-200 dark:border-slate-800"
          >
            <ProjectCard
              title="Mac Cleaner for Devs"
              desc="Scan and delete developer caches, build artifacts, simulator data, and dependency folders. Privacy first, no uploads."
              tag="Desktop App"
              icon="/app-icons/mac_cleaner.webp"
              metrics="Rust • Tauri • React"
              path="/apps/maccleaner"
              color="blue"
            />
          </div>

          {/* Markle Section */}
          <div
            id="markle"
            className="py-8 border-t border-slate-200 dark:border-slate-800 first:border-t-0"
          >
            <ProjectCard
              title="Markle"
              desc="A powerful and user-friendly Markdown editor built with Electron. Combines the simplicity of Markdown with advanced features to enhance your productivity."
              tag="Desktop Editor"
              icon="/app-icons/markle.webp"
              metrics="Electron • React • SQLite"
              path="/apps/markle"
              color="emerald"
            />
          </div>

          <div
            id="auth"
            className="py-8 border-t border-slate-200 dark:border-slate-800"
          >
            <ProjectCard
              title="AuthFlow"
              desc="A complete authentication and authorization system built from scratch with JWT security, MFA, and role-based access control. Self-hosted on Raspberry Pi with Cloudflare Tunnels."
              tag="Architecture & Security"
              icon="/app-icons/authflow.webp"
              metrics="JWT • MFA • Self-Hosted"
              path="/apps/authflow"
              color="indigo"
            />
          </div>
        </article>
      </div>

      {/* Side Navigation */}
      <nav className="w-full capitalize font-medium text-gray-600 dark:text-gray-400 order-1 md:order-2 md:w-56 mb-8 md:mb-0 md:ml-8 md:sticky md:top-24 md:self-start">
        <div className="space-y-1">
          <div className="text-[10px] font-mono font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider px-3 py-2">
            Projects
          </div>

          <a
            href="#smart_words_dictionary"
            className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 border-l-2 border-transparent hover:border-emerald-500 dark:hover:border-emerald-400"
          >
            Smart Words Dictionary
          </a>

          <a
            href="#go_french"
            className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 border-l-2 border-transparent hover:border-amber-500 dark:hover:border-amber-400"
          >
            Go French
          </a>

          <a
            href="#frontend_pro"
            className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 border-l-2 border-transparent hover:border-green-500 dark:hover:border-green-400"
          >
            Frontend Pro
          </a>

          <a
            href="#pixel_shrink"
            className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 border-l-2 border-transparent hover:border-purple-500 dark:hover:border-purple-400"
          >
            PixelShrink
          </a>

          <a
            href="#mac_cleaner"
            className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 border-l-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400"
          >
            Mac Cleaner for Devs
          </a>

          <a
            href="#markle"
            className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 border-l-2 border-transparent hover:border-emerald-500 dark:hover:border-emerald-400"
          >
            Markle
          </a>

          <a
            href="#auth"
            className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 border-l-2 border-transparent hover:border-indigo-500 dark:hover:border-indigo-400"
          >
            AuthFlow
          </a>
        </div>
      </nav>
    </div>
  );
};
