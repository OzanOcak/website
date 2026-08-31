/* eslint-disable react/jsx-key */
"use client";

import React, { useState } from "react";
import {
  Code2,
  Zap,
  BarChart3,
  Target,
  Brain,
  Shield,
  Download,
  BookOpen,
  Filter,
  Menu,
  X,
  CheckCircle2,
  Terminal,
} from "lucide-react";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const technologies = [
    { name: "HTML5", count: "720 Qs", category: "Markup" },
    { name: "CSS3", count: "680 Qs", category: "Styling" },
    { name: "JavaScript", count: "850 Qs", category: "Language" },
    { name: "React", count: "620 Qs", category: "Framework" },
    { name: "TypeScript", count: "530 Qs", category: "Language" },
    { name: "Vue.js", count: "380 Qs", category: "Framework" },
    { name: "Angular", count: "420 Qs", category: "Framework" },
    { name: "Accessibility", count: "320 Qs", category: "WCAG / A11y" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 font-sans antialiased selection:bg-green-500 selection:text-white">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-gray-100/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white shadow-md">
              <Code2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-base font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Frontend<span className="text-green-500">Pro</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-700 dark:text-gray-300">
            <a
              href="#features"
              className="hover:text-green-500 transition-colors"
            >
              Features
            </a>
            <a
              href="#technologies"
              className="hover:text-green-500 transition-colors"
            >
              Stack
            </a>
            <a
              href="https://apps.apple.com/ca/app/frontend-pro/id6754517273"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow"
            >
              Get App
            </a>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 dark:text-gray-300 hover:text-green-500 focus:outline-none"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 space-y-3">
            <a
              href="#features"
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-700 dark:text-gray-300 hover:text-green-500 py-1 text-sm font-medium"
            >
              Features
            </a>
            <a
              href="#technologies"
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-700 dark:text-gray-300 hover:text-green-500 py-1 text-sm font-medium"
            >
              Stack
            </a>
            <a
              href="https://apps.apple.com/ca/app/frontend-pro/id6754517273"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg text-sm"
            >
              Get App
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gray-200 dark:bg-black py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 text-xs text-gray-700 dark:text-gray-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              4,200+ Practice Questions
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100 leading-[1.1]">
              Master <span className="text-green-500">Frontend Dev</span>{" "}
              Anywhere, Anytime.
            </h1>

            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-xl">
              Engineered practice sets covering HTML, CSS, JavaScript, React,
              Vue, Angular, TypeScript, and Accessibility with AI diagnostics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href="https://apps.apple.com/ca/app/frontend-pro/id6754517273"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 shadow-md"
              >
                <Download className="w-5 h-5" />
                Download on App Store
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-semibold px-6 py-3 rounded-lg transition duration-300"
              >
                Explore Features
              </a>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-gray-600 dark:text-gray-400 font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Full Offline
                Mode
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Free
              </span>
            </div>
          </div>

          {/* Minimal Device Frame Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[290px] rounded-[36px] border-[6px] border-gray-300 dark:border-gray-800 bg-gray-300 dark:bg-gray-900 p-2 shadow-2xl">
              <div className="rounded-[28px] bg-gray-100 dark:bg-black border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col justify-between h-[490px]">
                {/* Mobile Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-200/50 dark:bg-gray-900/50">
                  <div className="flex justify-between items-center text-xs text-gray-700 dark:text-gray-400 font-mono">
                    <span>ACCURACY TRACK</span>
                    <span className="text-green-500 font-bold">78%</span>
                  </div>
                  <div className="mt-2.5 h-1.5 w-full bg-gray-300 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[78%]" />
                  </div>
                </div>

                {/* Mobile Card Mock */}
                <div className="p-4 space-y-3 flex-1">
                  <div className="text-[11px] font-mono text-gray-500 uppercase tracking-wider">
                    JavaScript • Advanced
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Which type is returned by{" "}
                    <code className="text-green-600 dark:text-green-400 bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-xs">
                      typeof null
                    </code>
                    ?
                  </div>
                  <div className="space-y-2 pt-1">
                    {['"null"', '"undefined"', '"object"', '"number"'].map(
                      (opt, i) => (
                        <div
                          key={i}
                          className={`p-2.5 rounded-lg text-xs font-mono border ${
                            i === 2
                              ? "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400 font-bold"
                              : "border-gray-300 dark:border-gray-800 bg-gray-200/40 dark:bg-gray-900/40 text-gray-700 dark:text-gray-400"
                          }`}
                        >
                          {opt}
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Mobile App Navigation */}
                <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-200/50 dark:bg-gray-900/50 flex justify-around text-gray-500">
                  <BookOpen className="w-4 h-4 text-green-500" />
                  <BarChart3 className="w-4 h-4" />
                  <Target className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services/Features Section - Bento Grid */}
      <section
        id="features"
        className="py-24 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Built for Efficient Learning
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to clear technical interviews and master the
              modern web stack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1: Main */}
            <div className="md:col-span-2 p-8 rounded-lg bg-gray-300 dark:bg-gray-800 shadow-lg transform hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center text-white mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  4,200+ Practice Questions
                </h3>
                <p className="text-gray-800 dark:text-gray-300 leading-relaxed max-w-lg">
                  Deep coverage across HTML, CSS, JavaScript, React, Vue,
                  Angular, TypeScript, and WCAG Accessibility standards.
                </p>
              </div>
              <div className="mt-8 p-3 rounded bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 font-mono text-xs text-gray-700 dark:text-gray-300 flex items-center justify-between">
                <span>Modules: 8 Core Technologies</span>
                <Terminal className="w-4 h-4 text-green-500" />
              </div>
            </div>

            {/* Bento Card 2 */}
            <div className="bg-gray-300 dark:bg-gray-800 p-8 rounded-lg shadow-lg transform hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center text-white mb-6">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  Smart Performance Analysis
                </h3>
                <p className="text-gray-800 dark:text-gray-300 text-sm leading-relaxed">
                  AI insights track weak areas and generate customized revision
                  focus plans.
                </p>
              </div>
            </div>

            {/* Bento Card 3 */}
            <div className="bg-gray-300 dark:bg-gray-800 p-8 rounded-lg shadow-lg transform hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center text-white mb-6">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  Offline Mode
                </h3>
                <p className="text-gray-800 dark:text-gray-300 text-sm leading-relaxed">
                  Study anywhere, anytime - no server connection or latency
                  involved.
                </p>
              </div>
            </div>

            {/* Bento Card 4 */}
            <div className="md:col-span-2 bg-gray-300 dark:bg-gray-800 p-8 rounded-lg shadow-lg transform hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center text-white mb-6">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  Advanced Custom Test Filtering
                </h3>
                <p className="text-gray-800 dark:text-gray-300 leading-relaxed max-w-lg">
                  Generate mock exams based on specific technologies, difficulty
                  parameters, or historical error trends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stack/Technologies Section */}
      <section id="technologies" className="py-24 bg-gray-200 dark:bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Master All Technologies
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive exam tracks across essential web topics
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {technologies.map((tech, i) => (
              <div
                key={i}
                className="p-5 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 hover:border-green-500 transition-colors shadow-sm"
              >
                <div className="text-xs font-mono text-gray-500 mb-1">
                  {tech.category}
                </div>
                <div className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                  {tech.name}
                </div>
                <div className="text-xs font-mono text-green-500 font-semibold mt-2">
                  {tech.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Styled after your Web Security Text Block */}
      <section className="bg-gradient-to-r from-green-600 to-gray-100 via-gray-100 py-32 dark:from-green-600 dark:to-gray-900 dark:via-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Start Mastering Frontend Today
          </h2>
          <p className="text-lg text-gray-900 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Take full control of your web development interview prep with 4,200+
            offline questions and smart diagnostic tracking.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="https://apps.apple.com/ca/app/frontend-pro/id6754517273"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md inline-flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download App
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-200 dark:bg-black text-gray-600 dark:text-gray-400 py-12 border-t border-gray-300 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <Code2 className="w-6 h-6 text-green-500" />
            <span className="font-bold text-gray-900 dark:text-gray-100">
              Frontend Pro
            </span>
          </div>

          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-green-500 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-green-500 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-green-500 transition-colors">
              Support
            </a>
          </div>

          <div className="text-xs font-mono">
            © {new Date().getFullYear()} Frontend Pro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
