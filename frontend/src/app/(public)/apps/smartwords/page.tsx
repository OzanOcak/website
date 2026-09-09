/* eslint-disable react/jsx-key */
"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Brain,
  Zap,
  CheckCircle2,
  Download,
  Menu,
  X,
  Layers,
  GraduationCap,
  WifiOff,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      title: "100% Offline Architecture",
      desc: "Access over 30,000 words and 200,000 interactive practice questions without Wi-Fi or data connection.",
      icon: WifiOff,
    },
    {
      title: "Beyond Basic Definitions",
      desc: "Master essential categories often missed by standard dictionaries: Idioms, Phrasal Verbs, and Proverbs.",
      icon: Layers,
    },
    {
      title: "Adaptive Memory Tracking",
      desc: "Every word tracks your unique performance score, prioritizing forgotten words and weak spots for revision.",
      icon: Brain,
    },
    {
      title: "Targeted Exam Paths",
      desc: "Filter and practice specific vocabulary sets curated for IELTS, TOEFL, GRE, and real-world proficiency levels.",
      icon: GraduationCap,
    },
  ];

  const examCategories = [
    { name: "IELTS Prep", count: "Academic & General", tag: "Exam Track" },
    { name: "TOEFL Mastery", count: "High-Frequency Words", tag: "Exam Track" },
    {
      name: "GRE Vocabulary",
      count: "Advanced Verbal Track",
      tag: "Exam Track",
    },
    {
      name: "Phrasal Verbs",
      count: "Essential Combinations",
      tag: "Specialized",
    },
    {
      name: "Idioms & Sayings",
      count: "Natural Expressions",
      tag: "Specialized",
    },
    {
      name: "Proverbs Catalog",
      count: "Cultural Expressions",
      tag: "Specialized",
    },
  ];

  const stats = [
    { label: "Offline Database Words", value: "30,000+" },
    { label: "Practice Questions", value: "200,000+" },
    { label: "Targeted Exam Tracks", value: "IELTS / TOEFL / GRE" },
    { label: "Data Sync Requirement", value: "0 (Local First)" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 -mt-4">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Smart
              <span className="text-indigo-600 dark:text-indigo-400">
                Words
              </span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <a
              href="#features"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#tracks"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Exam Tracks
            </a>
            <a
              href="#memory"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Memory Engine
            </a>

            <a
              href="https://apps.apple.com/ca/app/smart-words-dictionary/id6748163293"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-all shadow-md shadow-indigo-600/20"
            >
              Get App
            </a>
          </div>

          <div className="flex items-center space-x-3 md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
            <a
              href="#features"
              onClick={() => setIsMenuOpen(false)}
              className="block text-slate-700 dark:text-slate-300 hover:text-indigo-600 py-1 text-sm font-semibold"
            >
              Features
            </a>
            <a
              href="#tracks"
              onClick={() => setIsMenuOpen(false)}
              className="block text-slate-700 dark:text-slate-300 hover:text-indigo-600 py-1 text-sm font-semibold"
            >
              Exam Tracks
            </a>
            <a
              href="#memory"
              onClick={() => setIsMenuOpen(false)}
              className="block text-slate-700 dark:text-slate-300 hover:text-indigo-600 py-1 text-sm font-semibold"
            >
              Memory Engine
            </a>
            <a
              href="https://apps.apple.com/ca/app/smart-words-dictionary/id6748163293"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-sm shadow-md"
            >
              Get App
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-indigo-50/60 to-transparent dark:from-indigo-950/40 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-950/60 text-xs font-mono text-indigo-700 dark:text-indigo-300">
              <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              SQLite Powered • Zero Latency
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              The Ultimate <br />
              <span className="text-indigo-600 dark:text-indigo-400">
                Offline Vocabulary
              </span>{" "}
              Engine.
            </h1>

            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl">
              Master 30,000+ words, idioms, and phrasal verbs with 200,000+
              practice questions and adaptive memory tracking—completely
              offline.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href="https://apps.apple.com/ca/app/smart-words-dictionary/id6748163293"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-7 py-3.5 rounded-xl transition duration-300 shadow-lg shadow-indigo-600/25"
              >
                <Download className="w-5 h-5" />
                Download on App Store
              </a>
              <a
                href="#tracks"
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-600 font-bold px-7 py-3.5 rounded-xl transition duration-300 shadow-sm"
              >
                Explore Modules
              </a>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />{" "}
                100% Offline Database
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />{" "}
                Free
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />{" "}
                IELTS / TOEFL / GRE
              </span>
            </div>
          </div>

          {/* GIF Display */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[320px] rounded-[36px] border-[6px] border-gray-300 dark:border-gray-800 bg-gray-300 dark:bg-gray-900 p-2 shadow-2xl">
              <div className="rounded-[28px] bg-black border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col justify-between h-[580px]">
                {/* GIF Container */}
                <div className="flex-1 flex items-center justify-center p-4">
                  <img
                    src="/gif-files/smart_words.gif"
                    alt="Frontend Pro Demo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="py-10 bg-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-1">
              <div className="text-2xl md:text-3xl font-black">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-900 dark:text-white">
            Engineered for High-Recall Learning
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Combines structured dictionary lookup with spaced repetition
            algorithms and high-volume test sets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-indigo-500 transition-all ${
                  idx === 0 ? "md:col-span-2" : ""
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Exam Categories Section */}
      <section
        id="tracks"
        className="py-20 bg-slate-100 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
              Targeted Modules
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              Curated Vocabulary Tracks
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {examCategories.map((cat, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/60 transition-colors space-y-3 shadow-sm"
              >
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                    {cat.tag}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {cat.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {cat.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Memory Engine Focus */}
      <section id="memory" className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Brain className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
              Adaptive Memory Scoring Algorithm
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">
              Traditional flashcards ask you every word equally. Smart Words
              tracks a dynamic memory score for every single term based on your
              answer accuracy and review intervals.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  Filters out mastered words so you stop wasting time on what
                  you already know.
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  Automatically re-introduces forgotten words in upcoming
                  practice sets.
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Memory Card Representation */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
            <div className="flex justify-between items-center text-sm font-mono border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-slate-500 dark:text-slate-400">
                ALGORITHM STATUS
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                ACTIVE TRACKING
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-700 dark:text-slate-300">
                    IELTS Target Mastered
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    76%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 dark:bg-indigo-500 w-[76%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-700 dark:text-slate-300">
                    Weak / Forgotten Terms
                  </span>
                  <span className="text-amber-600 dark:text-amber-400">
                    12 Words Queued
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[24%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-24 max-w-6xl mx-auto px-6 text-center">
        <div className="p-12 rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-xl shadow-indigo-600/20 space-y-6">
          <h2 className="text-3xl md:text-5xl font-black">
            Build Your Mastery Today
          </h2>
          <p className="text-indigo-100 max-w-xl mx-auto text-base">
            Download Smart Words Dictionary and get complete offline access to
            30,000+ words and 200,000+ interactive questions.
          </p>
          <div className="pt-2 flex justify-center">
            <a
              href="https://apps.apple.com/ca/app/smart-words-dictionary/id6748163293"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 hover:bg-black text-white font-bold px-8 py-4 rounded-xl shadow-lg transition duration-300 inline-flex items-center gap-3"
            >
              <Download className="w-5 h-5 text-indigo-400" />
              Download on App Store
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
