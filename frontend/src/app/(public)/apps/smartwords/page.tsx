"use client";
import React from "react";
import {
  BookOpen,
  Brain,
  Target,
  Layers,
  BarChart,
  Lightbulb,
} from "lucide-react";
// If you are using Next.js and want optimized images, uncomment the line below:
// import Image from "next/image";

// Main page component for SmartWords Marketing
const App = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-white font-sans">
      {/* Hero Section */}
      <header className="relative h-screen bg-gradient-to-b from-blue-700 to-indigo-900 flex flex-col items-center justify-center text-center text-white p-6 md:p-8 lg:p-12 rounded-b-3xl shadow-xl">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 animate-fade-in-up">
          SmartWords: Offline English Master
        </h1>
        <p className="text-xl md:text-3xl lg:text-4xl font-semibold mb-8 max-w-4xl animate-fade-in-up delay-200">
          Your Smart Companion for English Mastery, Anywhere, Anytime.
        </p>

        {/* Key Highlights */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-12 animate-fade-in-up delay-300">
          <span className="text-3xl md:text-4xl font-bold bg-white text-blue-700 px-6 py-3 rounded-full shadow-md">
            30,000+ Words
          </span>
          <span className="text-3xl md:text-4xl font-bold bg-white text-blue-700 px-6 py-3 rounded-full shadow-md">
            200,000+ Exercises
          </span>
        </div>

        {/* Call to Action Button */}
        <a
          href="https://apps.apple.com/ca/app/smart-words-dictionary/id6748163293"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-blue-700 font-bold py-4 px-10 rounded-full text-xl md:text-2xl shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105 animate-fade-in-up delay-400"
        >
          Download on the App Store!
        </a>

        {/* Placeholder for a hero app screenshot or video - REMEMBER TO ADD YOUR IMAGE/VIDEO */}
        {/* If using Next.js Image component: */}
        {/* <Image
          src="/images/hero-app-screenshot.png" // Path to your hero screenshot in public/images
          alt="SmartWords App Interface"
          width={400} // Adjust width and height based on your image dimensions
          height={800}
          className="absolute bottom-[-10%] md:bottom-0 lg:bottom-[-20%] xl:bottom-[-25%] w-80 md:w-96 lg:w-[450px] xl:w-[500px] h-auto object-contain animate-float"
          style={{ transform: 'translateX(-50%)', left: '50%' }}
        /> */}
        {/* If using a standard img tag (less optimized but simpler for quick setup): */}
        {/* <img
          src="/images/hero-app-screenshot.png" // Path to your hero screenshot in public/images
          alt="SmartWords App Interface"
          className="absolute bottom-[-10%] md:bottom-0 lg:bottom-[-20%] xl:bottom-[-25%] w-80 md:w-96 lg:w-[450px] xl:w-[500px] h-auto object-contain animate-float"
          style={{ transform: 'translateX(-50%)', left: '50%' }}
        /> */}
      </header>

      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Learn English Offline, Smarter.
          </h2>
          <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto">
            SmartWords offers a truly comprehensive, offline English dictionary
            with intelligent learning tools. It&apos;s designed to personalize
            your vocabulary journey and boost your fluency, wherever you are. No
            internet connection is ever required for full functionality.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1: Comprehensive Database */}
            <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg flex flex-col items-center text-center">
              <BookOpen className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">
                Vast Word Database
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Access a colossal database of over **30,000 English words**,
                complete with definitions, examples, synonyms, and antonyms.
              </p>
            </div>

            {/* Feature Card 2: Smart Vocabulary Classification */}
            <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg flex flex-col items-center text-center">
              <Layers className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">
                Smart Classification
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Master words by type: nouns, verbs, adjectives, adverbs, idioms,
                phrasal verbs, proverbs, slang, and native-friendly alternatives
                for ESL learners.
              </p>
            </div>

            {/* Feature Card 3: Performance-Based Learning */}
            <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg flex flex-col items-center text-center">
              <Brain className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">
                Personalized Mastery
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Our intelligent system tracks your performance, helping you
                focus on areas needing the most improvement for faster progress.
              </p>
            </div>

            {/* Feature Card 4: Exam-Focused Word Sets */}
            <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg flex flex-col items-center text-center">
              <Target className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Exam Focused</h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Includes specialized vocabulary for TOEFL, IELTS, GRE, and other
                key English exams to boost your scores.
              </p>
            </div>

            {/* Feature Card 5: Flashcards & Practice Questions */}
            <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg flex flex-col items-center text-center">
              <Lightbulb className="w-12 h-12 text-yellow-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">
                Interactive Practice
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Engage with over **200,000 diverse exercises**, interactive
                flashcards, quizzes, and word lists to reinforce learning.
              </p>
            </div>

            {/* Feature Card 6: Visual Feedback & Progress Tracking */}
            <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg flex flex-col items-center text-center">
              <BarChart className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Visual Progress</h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Track your progress visually across word categories and levels,
                ensuring continuous improvement where it matters most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-r from-teal-500 to-blue-600 text-white text-center rounded-t-3xl shadow-xl mt-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Master English?
        </h2>
        {/* Call to Action Button */}
        <a
          href="https://apps.apple.com/ca/app/smart-words-dictionary/id6748163293"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-blue-700 font-bold py-4 px-10 rounded-full text-xl md:text-2xl shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105"
        >
          Download SmartWords Today!
        </a>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-gray-200 dark:bg-gray-900 text-center text-gray-600 dark:text-gray-400 rounded-b-3xl">
        <p>&copy; {new Date().getFullYear()} Oocak. All rights reserved.</p>
        <div className="mt-4 space-x-4">
          <a
            href="YOUR_PRIVACY_POLICY_URL_HERE" // REPLACE THIS
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Privacy Policy
          </a>
          <a
            href="YOUR_SUPPORT_URL_HERE" // REPLACE THIS
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Support
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;

// Basic animations (you'd typically put these in a global CSS file or a dedicated animation file)
// For simplicity, added inline here. If using Tailwind, ensure JIT mode or add to your config.
// You might need to add these keyframes to your global CSS or Tailwind config if they don't apply automatically
/*
@keyframes fadeInFromBottom {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0% { transform: translate(-50%, 0px); }
  50% { transform: translate(-50%, -10px); }
  100% { transform: translate(-50%, 0px); }
}

.animate-fade-in-up {
  animation: fadeInFromBottom 0.6s ease-out forwards;
}

.animate-fade-in-up.delay-200 { animation-delay: 0.2s; }
.animate-fade-in-up.delay-300 { animation-delay: 0.3s; }
.animate-fade-in-up.delay-400 { animation-delay: 0.4s; }

.animate-float {
  animation: float 3s ease-in-out infinite;
}
*/
