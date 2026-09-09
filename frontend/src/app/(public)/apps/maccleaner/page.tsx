/* eslint-disable react/jsx-key */
"use client";

import React, { useState } from "react";
import {
  Trash2,
  Scan,
  Shield,
  Download,
  Menu,
  X,
  CheckCircle2,
  FolderOpen,
  HardDrive,
  Package,
  Box,
  Terminal,
  Apple,
  Chrome,
  Code,
  Coffee,
  Database,
  Sparkles,
  AlertCircle,
  ChevronRight,
  Folder,
  Archive,
  Lock,
  Settings,
  Info,
  Cpu,
  Upload,
} from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const categories = [
    {
      id: "node_modules",
      name: "Node Modules",
      icon: Package,
      desc: "Project dependencies. Removing them may break the project temporarily; they can usually be restored with npm install.",
      size: "2.4 GB",
      risk: "Medium",
    },
    {
      id: "xcode_derived",
      name: "Xcode Derived Data",
      icon: Apple,
      desc: "Temporary build and indexing files. Safe to remove; Xcode will recreate them, but the next build may take longer.",
      size: "4.8 GB",
      risk: "Low",
    },
    {
      id: "simulator_data",
      name: "CoreSimulator Data",
      icon: Terminal,
      desc: "Files used by iOS simulators. Removing unused data may free substantial space, but simulator data may need to be recreated.",
      size: "3.1 GB",
      risk: "Low",
    },
    {
      id: "npm_cache",
      name: "NPM/Yarn Cache",
      icon: Box,
      desc: "Downloaded package archives. Safe to remove; they will be redownloaded when needed.",
      size: "850 MB",
      risk: "Low",
    },
    {
      id: "gradle_cache",
      name: "Gradle Cache",
      icon: Coffee,
      desc: "Downloaded Android build dependencies. Safe to remove, but future builds may be slower while dependencies are downloaded again.",
      size: "1.2 GB",
      risk: "Medium",
    },
    {
      id: "homebrew_cache",
      name: "Homebrew Cache",
      icon: Archive,
      desc: "Previously downloaded package files. Safe to remove; packages themselves are not uninstalled.",
      size: "620 MB",
      risk: "Low",
    },
    {
      id: "browser_cache",
      name: "Browser Caches",
      icon: Chrome,
      desc: "Temporary files created by browsers. Safe to remove, but some websites may load more slowly the next time you visit.",
      size: "1.8 GB",
      risk: "Low",
    },
    {
      id: "vscode_cache",
      name: "VS Code Cache",
      icon: Code,
      desc: "Temporary extension data. Extensions may rebuild their cache after deletion.",
      size: "450 MB",
      risk: "Low",
    },
    {
      id: "pip_cache",
      name: "Python Pip Cache",
      icon: Database,
      desc: "Downloaded Python packages. Safe to remove; they will be redownloaded.",
      size: "380 MB",
      risk: "Low",
    },
    {
      id: "cargo_cache",
      name: "Rust Cargo Cache",
      icon: HardDrive,
      desc: "Rust package registry cache. Safe to remove; cargo will redownload.",
      size: "520 MB",
      risk: "Low",
    },
  ];

  const stats = [
    { label: "Total Scanned", value: "164 GB" },
    { label: "Safe to Remove", value: "14.6 GB" },
    { label: "Categories Found", value: "10" },
    { label: "Privacy First", value: "100%" },
  ];

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const totalSelectedSize = categories
    .filter((cat) => selectedItems.includes(cat.id))
    .reduce((acc, cat) => {
      const size = parseFloat(cat.size.replace(" GB", "").replace(" MB", ""));
      return acc + (cat.size.includes("GB") ? size * 1000 : size);
    }, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-zinc-900 dark:text-zinc-100 font-sans antialiased selection:bg-blue-500 selection:text-white transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-50/80 dark:bg-zinc-900/95 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 shadow-lg -mt-4">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Trash2 className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Mac
              <span className="text-blue-500 dark:text-blue-400">
                Cleaner
              </span>{" "}
              <span className="text-xs font-bold tracking-tight text-slate-900 dark:text-white italic">
                for Devs
              </span>
            </span>
            <span className="hidden md:inline-flex ml-3 px-2.5 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/30 text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 tracking-widest">
              v1.0
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-zinc-400">
            <a
              href="#scan"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Scan
            </a>
            <a
              href="#categories"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Categories
            </a>
            <a
              href="#download"
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-all shadow-md shadow-blue-500/20"
            >
              Download
            </a>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
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
              href="#scan"
              onClick={() => setIsMenuOpen(false)}
              className="block text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 py-1 text-sm font-medium"
            >
              Scan
            </a>
            <a
              href="#categories"
              onClick={() => setIsMenuOpen(false)}
              className="block text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 py-1 text-sm font-medium"
            >
              Categories
            </a>
            <a
              href="#download"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-center bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm"
            >
              Download
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-mono text-blue-600 dark:text-blue-400">
              <Shield className="w-3.5 h-3.5" />
              Privacy First • 100% Local
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
              Clean Your Mac
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                Like a Developer
              </span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-zinc-400 leading-relaxed max-w-xl">
              Find and delete developer caches, build artifacts, simulator data,
              and dependency folders. Everything stays on your machine.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold  rounded-xl transition duration-300 shadow-lg shadow-blue-500/25">
                <a
                  href="https://github.com/OzanOcak/Mac-Cleaner-for-Devs"
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
                <Lock className="w-4 h-4 text-blue-500" />
                No Uploads
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                No Tracking
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                No Analytics
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
                    MacCleaner — Ready
                  </span>
                </div>
              </div>

              {/* GIF Container */}
              <div className="flex-1 flex items-center justify-center p-4">
                <img
                  src="/gif-files/mac-cleaner.gif"
                  alt="Mac Cleaner Demo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="py-10 bg-gradient-to-r from-blue-600 to-blue-800 border-y border-blue-500/30">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-1">
              <div className="text-3xl md:text-4xl font-black text-white">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
            Scan Categories
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-2">
            What Can You Clean?
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto mt-4">
            Review everything before deletion. Select items you want to remove.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedItems.includes(cat.id);
            return (
              <div
                key={cat.id}
                onClick={() => toggleItem(cat.id)}
                className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-lg shadow-blue-500/10"
                    : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-500/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {cat.name}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">
                          {cat.size}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            cat.risk === "Low"
                              ? "bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400"
                              : "bg-yellow-100 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-400"
                          }`}
                        >
                          {cat.risk}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-blue-500 border-blue-500"
                          : "border-slate-300 dark:border-zinc-600"
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="mt-8 p-6 rounded-2xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="text-sm text-slate-600 dark:text-zinc-400">
              <span className="font-bold text-slate-900 dark:text-white">
                {selectedItems.length}
              </span>{" "}
              items selected
            </span>
            <span className="text-sm text-slate-600 dark:text-zinc-400">
              Total:{" "}
              <span className="font-bold text-red-600 dark:text-red-400">
                {totalSelectedSize > 1000
                  ? `${(totalSelectedSize / 1000).toFixed(1)} GB`
                  : `${totalSelectedSize.toFixed(0)} MB`}
              </span>
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedItems([])}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              Deselect All
            </button>
            <button
              disabled={selectedItems.length === 0}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${
                selectedItems.length === 0
                  ? "bg-slate-300 dark:bg-zinc-700 text-slate-500 dark:text-zinc-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-lg shadow-red-500/20"
              }`}
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </button>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-20 bg-slate-100 dark:bg-zinc-950 border-y border-slate-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mx-auto mb-4">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Privacy First
              </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400">
                Your files never leave your machine. No uploads, no tracking, no
                analytics.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mx-auto mb-4">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Review Before Deletion
              </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400">
                Everything is reviewed and confirmed before any action is taken.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mx-auto mb-4">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Free & Open Source
              </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400">
                Completely free to use. Built for developers, by developers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="download"
        className="py-24 max-w-6xl mx-auto px-6 text-center"
      >
        <div className="p-16 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 border border-blue-500/30 shadow-2xl shadow-blue-500/20 space-y-6">
          <h2 className="text-3xl md:text-5xl font-black text-white">
            Free Up Your Developer Machine
          </h2>
          <p className="text-blue-200 max-w-xl mx-auto text-base">
            Download Mac Cleaner for Devs and reclaim gigabytes of storage from
            build artifacts and caches.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button className="bg-white hover:bg-zinc-100 text-zinc-900 font-bold px-8 py-4 rounded-xl shadow-lg transition duration-300 inline-flex items-center gap-3">
              <Download className="w-5 h-5 text-blue-600" />
              Download for macOS
            </button>
          </div>
          <p className="text-xs text-blue-300/70 font-mono mt-4">
            v1.0 • Requires macOS 12+ • Apple Silicon & Intel
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <Trash2 className="w-6 h-6 text-blue-500" />
            <span className="font-bold text-slate-900 dark:text-white">
              MacCleaner
            </span>
          </div>

          <div className="flex gap-6 text-sm text-slate-500 dark:text-zinc-500">
            <a
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              GitHub
            </a>
            <a
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Documentation
            </a>
            <a
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              MIT License
            </a>
          </div>

          <div className="text-xs font-mono text-slate-400 dark:text-zinc-600">
            © {new Date().getFullYear()} MacCleaner for Devs. Made with ❤️
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
