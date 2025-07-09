"use client";
import React from "react";
// If you are using Next.js and want optimized images, uncomment the line below:
// import Image from "next/image";

// Main page component for SmartWords Marketing
const Page = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-white">
      {/* Hero Section */}
      <header className="relative h-screen bg-gradient-to-b from-blue-700 to-indigo-900 flex flex-col items-center justify-center text-center text-white p-6 md:p-8 lg:p-12">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 animate-fade-in-up">
          SmartWords: Offline English Master
        </h1>
        <p className="text-xl md:text-3xl lg:text-4xl font-semibold mb-8 max-w-4xl animate-fade-in-up delay-200">
          Your Smart Companion for English Mastery, Anywhere, Anytime.
        </p>
        <p className="text-lg md:text-xl lg:text-2xl mb-12 max-w-3xl animate-fade-in-up delay-300">
          Experience a truly comprehensive, offline English dictionary with
          intelligent learning tools designed to personalize your vocabulary
          journey and boost your fluency.
        </p>

        {/* Call to Action Button */}
        <a
          href="YOUR_APP_STORE_LINK_HERE" // REPLACE THIS WITH YOUR APP STORE LINK ONCE LIVE
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

      {/* Feature Section: Truly Offline & Comprehensive */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl font-bold mb-4">
              Truly Offline & Comprehensive
            </h2>
            <p className="text-lg mb-6">
              Access a colossal database of over 30,000 English words and more
              than 200,000 practice questions right from your device. No
              internet connection is ever required for full functionality. Learn
              on the subway, on a plane, or in a remote area – no Wi-Fi or data
              needed!
            </p>
            {/* You can add more specific details or benefits here */}
          </div>
          <div className="md:w-1/2">
            {/* Placeholder for screenshot/video of offline feature */}
            {/* <img src="/images/feature-offline.png" alt="Offline Access Screenshot" className="rounded-xl shadow-lg w-full h-auto" /> */}
            {/* OR: <video controls src="/videos/offline-demo.mp4" className="rounded-xl shadow-lg w-full h-auto" /> */}
          </div>
        </div>
      </section>

      {/* Feature Section: Built for Real-World English & Advanced Filtering */}
      <section className="py-20 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Built for Real-World English & Advanced Filtering
          </h2>
          <p className="text-xl text-center mb-12 max-w-4xl mx-auto">
            Go beyond basic definitions. Our dictionary includes essential
            categories and unique filtering options to supercharge your
            learning.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-2">
                Detailed Word Types
              </h3>
              <p className="text-lg">
                Clearly defined entries for **Nouns, Verbs, Adjectives,
                Adverbs**, and more.
              </p>
              {/* <img src="/images/feature-word-types.png" alt="Word Types Screenshot" className="mt-4 rounded-lg shadow-md w-full h-auto" /> */}
            </div>
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-2">
                Real-World Usage: Idioms, Phrasal Verbs, Proverbs & Slang
              </h3>
              <p className="text-lg">
                Understand and correctly use common English expressions, crucial
                verb combinations, traditional sayings, and stay current with
                informal language.
              </p>
              {/* <img src="/images/feature-real-world.png" alt="Real World English Screenshot" className="mt-4 rounded-lg shadow-md w-full h-auto" /> */}
            </div>
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-2">
                Filter by Daily Usage Frequency
              </h3>
              <p className="text-lg">
                Prioritize learning by filtering words based on their actual
                usage frequency in daily life. Focus on what matters most!
              </p>
              {/* <img src="/images/feature-frequency.png" alt="Frequency Filter Screenshot" className="mt-4 rounded-lg shadow-md w-full h-auto" /> */}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section: Targeted Exam Preparation */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl font-bold mb-4">
              Boost Your Scores: Targeted Exam Preparation
            </h2>
            <p className="text-lg mb-6">
              Preparing for high-stakes English tests? SmartWords has you
              covered with over **15,000 dedicated words and thousands of
              practice exercises** specifically for:
            </p>
            <ul className="list-disc list-inside text-lg mb-6 space-y-2">
              <li>**IELTS** (International English Language Testing System)</li>
              <li>**TOEFL** (Test of English as a Foreign Language)</li>
              <li>**GRE** (Graduate Record Examinations)</li>
            </ul>
            <p className="text-lg">
              Focus on the vocabulary that will truly boost your score.
            </p>
          </div>
          <div className="md:w-1/2">
            {/* Placeholder for screenshot/video of exam prep feature */}
            {/* <img src="/images/feature-exam-prep.png" alt="Exam Prep Screenshot" className="rounded-xl shadow-lg w-full h-auto" /> */}
          </div>
        </div>
      </section>

      {/* Feature Section: Smart Learning Ecosystem & Personalized Mastery */}
      <section className="py-20 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Smart Learning Ecosystem: Your Path to Mastery
          </h2>
          <p className="text-xl text-center mb-12 max-w-4xl mx-auto">
            SmartWords isn&apos;t just a dictionary; it&apos;s a dynamic,
            personalized learning companion. All learning tools are integrated
            to work with your selected dictionary filters and personal progress.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">
                Intelligent Memory Tracking: SmartWords in Action
              </h3>
              <p className="text-lg mb-4">
                This is why it&apos;s &quot;SmartWords&quot;! Every word in the
                app keeps track of how many times it&apos;s been answered
                correctly in questions. Your personal &quot;memory&quot; score
                adapts as you learn.
              </p>
              <p className="text-lg">
                Our smart system identifies words you&apos;ve learned and those
                you need to revisit, allowing you to **filter the dictionary and
                learning sessions based on what you need to master!**
              </p>
              {/* <img src="/images/feature-memory-tracking.png" alt="Memory Tracking Screenshot" className="mt-4 rounded-lg shadow-md w-full h-auto" /> */}
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">
                Powerful, Filter-Driven Practice Modes
              </h3>
              <p className="text-lg mb-4">
                Dive into **200,000+ interactive practice questions** designed
                to solidify your understanding. Then, leverage our diverse
                learning tools, all powered by your specific dictionary filters
                and memory scores:
              </p>
              <ul className="list-disc list-inside text-lg space-y-2 mb-4">
                <li>
                  **Flashcards:** Utilize classic flashcard drills for rapid
                  memorization and quick reviews.
                </li>
                <li>
                  **Custom Word Lists:** Create and manage your own personalized
                  word lists for specific topics or study goals.
                </li>
                <li>
                  **Graphical Feedback:** See your learning progress visually,
                  relying on your real performance data.
                </li>
              </ul>
              <p className="text-lg font-semibold">
                You control your learning: filter by word type, usage frequency,
                difficulty, exam category, or your personal memory score!
              </p>
              {/* <img src="/images/feature-practice-modes.png" alt="Practice Modes Screenshot" className="mt-4 rounded-lg shadow-md w-full h-auto" /> */}
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-r from-teal-500 to-blue-600 text-white text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Take Control of Your English Learning Journey!
        </h2>
        <a
          href="YOUR_APP_STORE_LINK_HERE" // REPLACE THIS WITH YOUR APP STORE LINK ONCE LIVE
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-teal-600 font-bold py-4 px-12 rounded-full text-xl md:text-2xl shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105"
        >
          Download SmartWords Now!
        </a>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-gray-200 dark:bg-gray-900 text-center text-gray-600 dark:text-gray-400">
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

export default Page;

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
