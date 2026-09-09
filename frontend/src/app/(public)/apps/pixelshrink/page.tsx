/* eslint-disable react/jsx-key */
"use client";

import React, { useState } from "react";
import {
  Image,
  Zap,
  Cpu,
  Shield,
  Download,
  Upload,
  Menu,
  X,
  CheckCircle2,
  Terminal,
  Monitor,
  Layers,
  Sparkles,
  Settings,
  FolderOpen,
  Save,
  Trash2,
  Info,
} from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const stats = [
    { label: "Total Images Optimized", value: "2,847" },
    { label: "Data Saved", value: "4.2 GB" },
    { label: "Avg. Compression", value: "94.7%" },
    { label: "Processing Speed", value: "2.3x" },
  ];

  const features = [
    {
      title: "Visually Lossless Compression",
      desc: "Shrink 1.2 MB files down to 15 KB while keeping near-perfect visual quality. Your eyes won't notice the difference.",
      icon: Sparkles,
    },
    {
      title: "Metadata Stripping",
      desc: "Automatically purge EXIF, GPS, color profiles, and software headers. Remove up to 200 KB of hidden bloat per image.",
      icon: Shield,
    },
    {
      title: "High-Ratio Quantization",
      desc: "Intelligently group millions of color shades into optimized palettes, drastically reducing file size without visible artifacts.",
      icon: Layers,
    },
    {
      title: "Batch Processing",
      desc: "Optimize hundreds of images at once with native Rust speed. Built for production workflows and large catalogs.",
      icon: Zap,
    },
  ];

  const compressionLevels = [
    { name: "Lossless", ratio: "1.2x", quality: "100%" },
    { name: "Visually Lossless", ratio: "80x", quality: "98%" },
    { name: "High Compression", ratio: "120x", quality: "92%" },
    { name: "Maximum", ratio: "200x", quality: "85%" },
  ];

  return (
    // Replace hardcoded dark colors with theme-aware classes
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-zinc-900 dark:text-zinc-100 font-sans antialiased selection:bg-purple-500 selection:text-white transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-50/80 dark:bg-zinc-900/95 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 shadow-lg -mt-4">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
              <Image className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Pixel
              <span className="text-purple-500 dark:text-purple-400">
                Shrink
              </span>
            </span>
            <span className="hidden md:inline-flex ml-3 px-2.5 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/30 text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 tracking-widest">
              RUST + REACT
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-zinc-400">
            <a
              href="#features"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#compression"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Compression
            </a>
            <a
              href="#benchmark"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Benchmarks
            </a>
            <a
              href="#download"
              className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-all shadow-md shadow-purple-500/20"
            >
              Download
            </a>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 focus:outline-none"
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
              className="block text-slate-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 py-1 text-sm font-medium"
            >
              Features
            </a>
            <a
              href="#compression"
              onClick={() => setIsMenuOpen(false)}
              className="block text-slate-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 py-1 text-sm font-medium"
            >
              Compression
            </a>
            <a
              href="#benchmark"
              onClick={() => setIsMenuOpen(false)}
              className="block text-slate-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 py-1 text-sm font-medium"
            >
              Benchmarks
            </a>
            <a
              href="#download"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-center bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold py-2.5 rounded-xl text-sm"
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-mono text-purple-600 dark:text-purple-400">
              <Cpu className="w-3.5 h-3.5" />
              Native Performance • Rust Backend
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
              Aggressive{" "}
              <span className="bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">
                Web Optimization
              </span>
              <br />
              for Desktop
            </h1>

            <p className="text-lg text-slate-600 dark:text-zinc-400 leading-relaxed max-w-xl">
              Visually lossless compression, metadata purging, and high-ratio
              quantization. Built with Rust for blazing-fast desktop
              performance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-bold  rounded-xl transition duration-300 shadow-lg shadow-purple-500/25">
                <a
                  href="https://github.com/OzanOcak/Pixel-Shrink"
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
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
                Batch Processing
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
                Lossless + Lossy
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
                Rust Native
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
                    PixelShrink v2.0 — /uploads
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-slate-400 dark:text-zinc-600">
                  <Settings className="w-4 h-4 hover:text-slate-600 dark:hover:text-zinc-400 cursor-pointer" />
                  <Info className="w-4 h-4 hover:text-slate-600 dark:hover:text-zinc-400 cursor-pointer" />
                </div>
              </div>

              {/* GIF Container */}
              <div className="flex-1 flex items-center justify-center p-4">
                <img
                  src="/gif-files/pixel_shrink.gif"
                  alt="PixelShrink Demo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="py-10 bg-gradient-to-r from-purple-600 to-purple-800 border-y border-purple-500/30">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-1">
              <div className="text-3xl md:text-4xl font-black text-white">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-purple-200 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 tracking-wider uppercase">
            Core Technology
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-2">
            Three Pillars of Aggressive Optimization
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-purple-500/50 transition-all shadow-lg ${
                  idx === 0 ? "md:col-span-2" : ""
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
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

      {/* Compression Levels */}
      <section
        id="compression"
        className="py-20 bg-slate-100 dark:bg-zinc-950 border-y border-slate-200 dark:border-zinc-800"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 tracking-wider uppercase">
              Compression Settings
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              Choose Your Optimization Level
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {compressionLevels.map((level, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-purple-500/50 transition-all text-center"
              >
                <div className="text-3xl font-black text-slate-900 dark:text-white">
                  {level.name}
                </div>
                <div className="mt-2 text-2xl font-black bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">
                  {level.ratio}
                </div>
                <div className="mt-1 text-sm text-slate-500 dark:text-zinc-500 font-mono">
                  Quality: {level.quality}
                </div>
                <div className="mt-4 h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"
                    style={{
                      width:
                        level.name === "Lossless"
                          ? "25%"
                          : level.name === "Visually Lossless"
                            ? "80%"
                            : level.name === "High Compression"
                              ? "95%"
                              : "100%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="download"
        className="py-24 max-w-6xl mx-auto px-6 text-center"
      >
        <div className="p-16 rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-700 dark:to-purple-900 border border-purple-500/30 shadow-2xl shadow-purple-500/20 space-y-6">
          <h2 className="text-3xl md:text-5xl font-black text-white">
            Optimize Smarter, Faster.
          </h2>
          <p className="text-purple-200 max-w-xl mx-auto text-base">
            Download PixelShrink for desktop and experience native Rust
            performance with visually lossless compression.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button className="bg-white hover:bg-zinc-100 text-zinc-900 font-bold px-8 py-4 rounded-xl shadow-lg transition duration-300 inline-flex items-center gap-3">
              <Download className="w-5 h-5 text-purple-600" />
              Download for macOS
            </button>
          </div>
          <p className="text-xs text-purple-300/70 font-mono mt-4">
            Open source • Built with Rust, Tauri, React, TypeScript
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <Image className="w-6 h-6 text-purple-500" />
            <span className="font-bold text-slate-900 dark:text-white">
              PixelShrink
            </span>
          </div>

          <div className="flex gap-6 text-sm text-slate-500 dark:text-zinc-500">
            <a
              href="#"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              GitHub
            </a>
            <a
              href="#"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Documentation
            </a>
            <a
              href="#"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              MIT License
            </a>
          </div>

          <div className="text-xs font-mono text-slate-400 dark:text-zinc-600">
            © {new Date().getFullYear()} PixelShrink. Made with 🦀 Rust.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
