/* eslint-disable react/jsx-key */
"use client";

import React, { useState } from "react";
import {
  FileText,
  Menu,
  X,
  Download,
  CheckCircle2,
  FolderOpen,
  FileCode,
  FileJson,
  File,
  BookOpen,
  Code,
  Database,
  Sparkles,
  Layout,
  Paintbrush,
  Share2,
  Zap,
  Layers,
  Image,
} from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      title: "VSCode-like Explorer",
      desc: "Navigate your projects effortlessly with an intuitive file explorer that keeps your workspace organized.",
      icon: FolderOpen,
    },
    {
      title: "Multiple Export Formats",
      desc: "Seamlessly export your documents in HTML, Markdown, and PDF formats for easy sharing and publishing.",
      icon: Share2,
    },
    {
      title: "LaTeX Support",
      desc: "Perfect for academics and technical writers. Typeset complex mathematical equations with full LaTeX support.",
      icon: Sparkles,
    },
    {
      title: "Mermaid Integration",
      desc: "Create beautiful diagrams and flowcharts directly within your documents using Mermaid syntax.",
      icon: Image,
    },
    {
      title: "Code Snippets",
      desc: "Boost your coding efficiency with customizable code snippets that save you time and effort.",
      icon: Code,
    },
    {
      title: "Front Matter Builder",
      desc: "Easily manage metadata with our front matter builder, adding essential information to your Markdown files.",
      icon: FileJson,
    },
    {
      title: "SQLite Support",
      desc: "Utilize SQLite for efficient data storage and management, making it easy to handle your notes and documents.",
      icon: Database,
    },
    {
      title: "Clean & Modern UI",
      desc: "Enjoy a clean and modern interface designed for a smooth writing experience.",
      icon: Layout,
    },
  ];

  const exportFormats = [
    { name: "HTML", icon: FileCode },
    { name: "Markdown", icon: FileText },
    { name: "PDF", icon: File },
  ];

  const stats = [
    { label: "Markdown Editor", value: "Markle" },
    { label: "Export Formats", value: "3+" },
    { label: "Built With", value: "Electron" },
    { label: "Platforms", value: "macOS / Win / Linux" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-zinc-900 dark:text-zinc-100 font-sans antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-50/80 dark:bg-zinc-900/95 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 shadow-lg -mt-4">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
              <FileText className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              <span className="text-emerald-500 dark:text-emerald-400">
                Mark
              </span>
              le
            </span>
            <span className="hidden md:inline-flex ml-3 px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-widest">
              v1.0
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-zinc-400">
            <a
              href="#features"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#export"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Export
            </a>
            <a
              href="#download"
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-all shadow-md shadow-emerald-500/20"
            >
              Download
            </a>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 focus:outline-none"
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
          <div className="md:hidden px-6 py-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 space-y-3">
            <a
              href="#features"
              onClick={() => setIsMenuOpen(false)}
              className="block text-slate-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 py-1 text-sm font-medium"
            >
              Features
            </a>
            <a
              href="#export"
              onClick={() => setIsMenuOpen(false)}
              className="block text-slate-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 py-1 text-sm font-medium"
            >
              Export
            </a>
            <a
              href="#download"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-center bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-semibold py-2.5 rounded-xl text-sm"
            >
              Download
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/20 dark:to-transparent">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-mono text-emerald-600 dark:text-emerald-400">
              <Zap className="w-3.5 h-3.5" />
              Electron • React • TypeScript
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
              Unlock Your
              <br />
              <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
                Writing Potential
              </span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-zinc-400 leading-relaxed max-w-xl">
              A powerful and user-friendly Markdown editor built with Electron.
              Combines the simplicity of Markdown with advanced features to
              enhance your productivity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white font-bold  rounded-xl transition duration-300 shadow-lg shadow-emerald-500/25">
                <a
                  href="https://github.com/OzanOcak/merkle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-zinc-100 text-zinc-900 font-bold px-8 py-4 rounded-xl shadow-lg transition duration-300 inline-flex items-center gap-3"
                >
                  <GitHubLogoIcon className="w-5 h-5 text-indigo-600" />
                  View on GitHub
                </a>
              </button>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-zinc-500 font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                VSCode-like Explorer
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                LaTeX Support
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Mermaid Integration
              </span>
            </div>
          </div>

          {/* Desktop GUI Mockup with GIF */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm shadow-2xl overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-100/50 dark:bg-zinc-900/50">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs text-slate-500 dark:text-zinc-500 font-mono">
                    Markle — Untitled.md
                  </span>
                </div>
              </div>

              {/* GIF Container */}
              <div className="flex-1 flex items-center justify-center p-4">
                <img
                  src="/gif-files/markle.gif"
                  alt="Markle Demo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="py-10 bg-gradient-to-r from-emerald-600 to-emerald-800 border-y border-emerald-500/30">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-1">
              <div className="text-2xl md:text-3xl font-black text-white">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-2">
            Everything You Need to Write
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto mt-4">
            Built for writers, developers, and anyone who loves to create.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-emerald-500/50 transition-all shadow-lg ${
                  idx === 0 || idx === 6 ? "md:col-span-2" : ""
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Export Formats Section */}
      <section
        id="export"
        className="py-20 bg-slate-100 dark:bg-zinc-950 border-y border-slate-200 dark:border-zinc-800"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
              Export Options
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              Share Your Work Anywhere
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto mt-4">
              Seamlessly export your documents in multiple formats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {exportFormats.map((format, i) => {
              const Icon = format.icon;
              return (
                <div
                  key={i}
                  className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-emerald-500/50 transition-all text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-4">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {format.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">
                    Export your documents to {format.name} format
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
            Tech Stack
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            Built for Performance
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Electron", icon: Zap },
            { name: "React", icon: Code },
            { name: "TypeScript", icon: FileCode },
            { name: "SQLite", icon: Database },
          ].map((tech, i) => {
            const Icon = tech.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-emerald-500/50 transition-all text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {tech.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="download"
        className="py-24 max-w-6xl mx-auto px-6 text-center"
      >
        <div className="p-16 rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 dark:from-emerald-700 dark:to-emerald-900 border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 space-y-6">
          <h2 className="text-3xl md:text-5xl font-black text-white">
            Start Writing with Markle
          </h2>
          <p className="text-emerald-200 max-w-xl mx-auto text-base">
            Download Markle and unlock your writing potential today.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button className="bg-white hover:bg-zinc-100 text-zinc-900 font-bold px-8 py-4 rounded-xl shadow-lg transition duration-300 inline-flex items-center gap-3">
              <Download className="w-5 h-5 text-emerald-600" />
              Download for macOS
            </button>
          </div>
          <p className="text-xs text-emerald-300/70 font-mono mt-4">
            Open source • Built with Electron, React, TypeScript
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-emerald-500" />
            <span className="font-bold text-slate-900 dark:text-white">
              Markle
            </span>
          </div>

          <div className="flex gap-6 text-sm text-slate-500 dark:text-zinc-500">
            <a
              href="#"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              GitHub
            </a>
            <a
              href="#"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Documentation
            </a>
            <a
              href="#"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              MIT License
            </a>
          </div>

          <div className="text-xs font-mono text-slate-400 dark:text-zinc-600">
            © {new Date().getFullYear()} Markle. Made with ❤️
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
