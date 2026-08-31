/* eslint-disable react/jsx-key */
"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Mic,
  Sparkles,
  CheckCircle2,
  Download,
  Menu,
  X,
  Languages,
  Volume2,
  MapPin,
  Search,
  Compass,
} from "lucide-react";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      title: "Story-First Immersion",
      desc: "Learn naturally through continuous narratives set in Montréal. Listen to native speech tracks synced line-by-line with text translation.",
      icon: BookOpen,
    },
    {
      title: "1,000+ English-French Cognates",
      desc: "Fast-track fluency by tapping into words that look and mean the exact same in English and French (e.g., confortable, attention).",
      icon: Sparkles,
    },
    {
      title: "Complete Exercise Suite",
      desc: "Master syntax with drag-and-drop Sentence Builders, test oral pronunciation with live mic feedback, and solve visual quizzes.",
      icon: Mic,
    },
    {
      title: "1,200+ Word Smart Dictionary",
      desc: "Filter by word types (nouns, verbs, adjectives), inspect verb tenses, and check noun genders without leaving the app.",
      icon: Search,
    },
  ];

  const stats = [
    { label: "Interactive Chapters", value: "93" },
    { label: "Story Adventures", value: "25" },
    { label: "Cognate Vocabulary", value: "1,000+" },
    { label: "Dictionary Words", value: "1,200+" },
  ];

  return (
    <div className="min-h-screen bg-amber-50/40 text-stone-900 dark:bg-stone-950 dark:text-stone-100 font-sans antialiased selection:bg-amber-500 selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-amber-50/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-amber-200/60 dark:border-stone-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-md">
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Go
              <span className="text-amber-600 dark:text-amber-500">French</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-stone-700 dark:text-stone-300">
            <a
              href="#features"
              className="hover:text-amber-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#cognates"
              className="hover:text-amber-600 transition-colors"
            >
              Cognates
            </a>
            <a
              href="#dictionary"
              className="hover:text-amber-600 transition-colors"
            >
              Dictionary
            </a>
            <a
              href="#download"
              className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-all shadow-md shadow-amber-600/20"
            >
              Start Adventure
            </a>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-stone-700 dark:text-stone-300 hover:text-amber-600 focus:outline-none"
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
          <div className="md:hidden px-6 py-4 border-b border-amber-200 dark:border-stone-800 bg-amber-50 dark:bg-stone-950 space-y-3">
            <a
              href="#features"
              onClick={() => setIsMenuOpen(false)}
              className="block text-stone-700 dark:text-stone-300 hover:text-amber-600 py-1 text-sm font-semibold"
            >
              Features
            </a>
            <a
              href="#cognates"
              onClick={() => setIsMenuOpen(false)}
              className="block text-stone-700 dark:text-stone-300 hover:text-amber-600 py-1 text-sm font-semibold"
            >
              Cognates
            </a>
            <a
              href="#dictionary"
              onClick={() => setIsMenuOpen(false)}
              className="block text-stone-700 dark:text-stone-300 hover:text-amber-600 py-1 text-sm font-semibold"
            >
              Dictionary
            </a>
            <a
              href="#download"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-center bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-xl text-sm shadow-md"
            >
              Start Adventure
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-amber-100/60 to-transparent dark:from-stone-900/60 dark:to-transparent">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-300 dark:border-stone-800 bg-amber-100/80 dark:bg-stone-900 text-xs font-bold text-amber-900 dark:text-amber-400">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              Real Montréal Stories & Context
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-stone-900 dark:text-stone-100 leading-[1.1]">
              Ditch the drills. <br />
              Learn French through{" "}
              <span className="text-amber-600 dark:text-amber-500">
                Story Adventures.
              </span>
            </h1>

            <p className="text-lg text-stone-700 dark:text-stone-300 leading-relaxed max-w-xl">
              Meet local characters, explore 93 gamified chapters, and unlock
              real Canadian French fluency without dry flashcards.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href="#download"
                className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-7 py-3.5 rounded-xl transition duration-300 shadow-lg shadow-amber-600/25"
              >
                <Download className="w-5 h-5" />
                Download GoFrench
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-amber-600 font-bold px-7 py-3.5 rounded-xl transition duration-300 shadow-sm"
              >
                Explore Map
              </a>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-stone-600 dark:text-stone-400 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600" /> 1,000+
                Instant Cognates
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600" /> Synced
                Native Narration
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600" /> Free
              </span>
            </div>
          </div>

          {/* App Screen Frame Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[300px] rounded-[40px] border-[8px] border-stone-800 bg-stone-900 p-2.5 shadow-2xl shadow-amber-950/20">
              <div className="rounded-[30px] bg-amber-50/90 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col justify-between h-[520px] p-4 text-stone-900 dark:text-stone-100">
                {/* Mobile Header */}
                <div className="flex items-center justify-between pb-3 border-b border-amber-200 dark:border-stone-800">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-500 uppercase tracking-wider">
                    Une Journée à Montréal
                  </span>
                  <span className="text-xs font-mono font-bold bg-amber-200/60 dark:bg-stone-800 px-2 py-0.5 rounded-md text-amber-900 dark:text-amber-300">
                    Ch. 4
                  </span>
                </div>

                {/* Mobile Story Mock */}
                <div className="my-auto space-y-3.5">
                  <div className="p-3.5 rounded-xl bg-white dark:bg-stone-800 border border-amber-200/80 dark:border-stone-700 shadow-sm">
                    <p className="text-sm font-medium leading-relaxed">
                      `Je suis à Montréal. C’est une belle journée. Je regarde
                      la table.``
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 italic">
                      I am in Montreal. It is a beautiful day.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-100/70 dark:bg-stone-800/80 border border-amber-300 dark:border-stone-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold">Line Audio</span>
                    </div>
                    <span className="text-[11px] font-mono text-amber-800 dark:text-amber-400 font-bold">
                      Tap to play
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-600 text-white shadow-sm flex justify-between items-center text-xs font-bold">
                    <span>Build: `C&apos;est une bonne idée.`</span>
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>

                {/* Mobile Progress Bar */}
                <div className="pt-3 border-t border-amber-200 dark:border-stone-800">
                  <div className="flex justify-between items-center text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1.5">
                    <span>CHAPTER PROGRESS</span>
                    <span className="text-amber-600 dark:text-amber-400">
                      82%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600 w-[82%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="py-10 bg-amber-600 text-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-1">
              <div className="text-3xl md:text-4xl font-black">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-amber-100 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-stone-900 dark:text-stone-100">
            Why GoFrench Works
          </h2>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            Combines charming narratives, native speech tracks, and puzzle-like
            gameplay to anchor French in your memory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`p-8 rounded-2xl bg-white dark:bg-stone-900 border border-amber-200/70 dark:border-stone-800 shadow-lg shadow-amber-950/5 flex flex-col justify-between hover:border-amber-500 transition-all ${
                  idx === 0 ? "md:col-span-2" : ""
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-stone-800 flex items-center justify-center text-amber-600 dark:text-amber-500 mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-stone-900 dark:text-stone-100">
                    {item.title}
                  </h3>
                  <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cognates Spotlight */}
      <section
        id="cognates"
        className="py-20 bg-amber-100/50 dark:bg-stone-900/40 border-y border-amber-200/60 dark:border-stone-800"
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-500 tracking-wider uppercase">
            Instant Confidence
          </span>
          <h2 className="text-3xl font-black mt-2 mb-4">
            The Power of 1,000+ Cognates
          </h2>
          <p className="text-stone-600 dark:text-stone-400 max-w-xl mx-auto text-sm mb-12">
            You already know thousands of French words without knowing it.
            GoFrench highlights identical and near-identical terms from day one.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { fr: "confortable", en: "comfortable" },
              { fr: "parfait", en: "perfect" },
              { fr: "attention", en: "attention" },
            ].map((pair, i) => (
              <div
                key={i}
                className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-stone-800 shadow-sm flex items-center justify-between"
              >
                <span className="font-bold text-amber-700 dark:text-amber-400">
                  {pair.fr}
                </span>
                <Languages className="w-4 h-4 text-stone-400" />
                <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                  `{pair.en}``
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section
        id="download"
        className="py-24 max-w-6xl mx-auto px-6 text-center"
      >
        <div className="p-12 rounded-3xl bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-xl shadow-amber-600/20 space-y-6">
          <h2 className="text-3xl md:text-5xl font-black">
            Start Your French Adventure Today
          </h2>
          <p className="text-amber-100 max-w-xl mx-auto text-base">
            Master 93 chapters, explore 25 rich stories, and practice oral
            pronunciation with your local beaver guide.
          </p>
          <div className="pt-2 flex justify-center">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-stone-900 hover:bg-black text-white font-bold px-8 py-4 rounded-xl shadow-lg transition duration-300 inline-flex items-center gap-3"
            >
              <Download className="w-5 h-5 text-amber-500" />
              Download on the App Store
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
