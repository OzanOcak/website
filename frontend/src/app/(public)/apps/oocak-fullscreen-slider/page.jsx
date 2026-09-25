/* eslint-disable react/jsx-key */
"use client";

import React, { useState } from "react";
import {
  Layers,
  Shield,
  Download,
  Menu,
  X,
  CheckCircle2,
  Sparkles,
  Lock,
  MousePointerClick,
  Palette,
  Smartphone,
  Zap,
  Image as ImageIcon,
} from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const categories = [
    {
      id: "fullscreen",
      name: "Full-Screen Slides",
      icon: ImageIcon,
      desc: "Every slide fills the viewport. The image is the design — nothing else competes for attention.",
      size: "100vh",
      risk: "Core",
    },
    {
      id: "scroll-snap",
      name: "Scroll-Snap Navigation",
      icon: MousePointerClick,
      desc: "Each slide snaps cleanly into place. Users scroll naturally, and the slider follows.",
      size: "Smooth",
      risk: "Core",
    },
    {
      id: "animations",
      name: "Per-Slide Animations",
      icon: Sparkles,
      desc: "Text fades, slides, or zooms in. Images pan or zoom. Every slide can animate differently.",
      size: "10 modes",
      risk: "Motion",
    },
    {
      id: "positions",
      name: "Text Positioning",
      icon: Palette,
      desc: "Place text top-left, top-right, center, bottom-left, or bottom-right. Per slide.",
      size: "5 spots",
      risk: "Layout",
    },
    {
      id: "buttons",
      name: "Optional CTA Button",
      icon: Zap,
      desc: "Add a button to any slide. Link to a page on your site or a custom URL. Ghost or solid style.",
      size: "Per slide",
      risk: "CTA",
    },
    {
      id: "multiple",
      name: "Multiple Sliders",
      icon: Layers,
      desc: "Create unlimited sliders, each with its own shortcode. Use different ones on different pages.",
      size: "Unlimited",
      risk: "Core",
    },
    {
      id: "responsive",
      name: "Responsive Navigation",
      icon: Smartphone,
      desc: "Top nav on desktop, slide-in panel on tablet and mobile. Built-in, no configuration needed.",
      size: "All sizes",
      risk: "UX",
    },
    {
      id: "accessibility",
      name: "Accessibility",
      icon: Shield,
      desc: "Respects prefers-reduced-motion. Keyboard navigation. Semantic HTML with ARIA labels.",
      size: "A11y",
      risk: "Built-in",
    },
  ];

  const stats = [
    { label: "Frontend Size", value: "15 KB" },
    { label: "Animations", value: "10" },
    { label: "Text Positions", value: "5" },
    { label: "Dependencies", value: "0" },
  ];

  const toggleItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-zinc-900 dark:text-zinc-100 font-sans antialiased selection:bg-blue-500 selection:text-white transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-50/80 dark:bg-zinc-900/95 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 shadow-lg -mt-4">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Layers className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Fullscreen{" "}
              <span className="text-blue-500 dark:text-blue-400">Slider</span>
            </span>
            <span className="hidden md:inline-flex ml-3 px-2.5 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/30 text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 tracking-widest">
              v0.1.0
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-zinc-400">
            <a
              href="#features"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#demo"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Demo
            </a>
            <a
              href="https://wordpress.org/plugins/oocak-fullscreen-slider/"
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-all shadow-md shadow-blue-500/20"
            >
              Get it from WordPress.org
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

        {isMenuOpen && (
          <div className="md:hidden px-6 py-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 space-y-3">
            <a
              href="#features"
              onClick={() => setIsMenuOpen(false)}
              className="block text-slate-600 dark:text-zinc-400 py-1 text-sm font-medium"
            >
              Features
            </a>
            <a
              href="#demo"
              onClick={() => setIsMenuOpen(false)}
              className="block text-slate-600 dark:text-zinc-400 py-1 text-sm font-medium"
            >
              Demo
            </a>
            <a
              href="https://wordpress.org/plugins/oocak-fullscreen-slider/"
              className="block w-full text-center bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm"
            >
              Get it from WordPress.org
            </a>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-mono text-blue-600 dark:text-blue-400">
              <Shield className="w-3.5 h-3.5" />
              Free · GPL-2.0 · No Tracking
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
              Build Full-Screen
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                Scroll Experiences
              </span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-zinc-400 leading-relaxed max-w-xl">
              A WordPress plugin for single-page landing experiences.
              Full-screen slides, scroll-snap navigation, per-slide animations,
              and a modern React admin editor.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href="https://wordpress.org/plugins/oocak-fullscreen-slider/"
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/25 transition duration-300 inline-flex items-center justify-center gap-3"
              >
                <Download className="w-5 h-5" />
                Get it from WordPress.org
              </a>
              <a
                href="https://github.com/OzanOcak/oocak-fullscreen-slider"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold px-8 py-4 rounded-xl shadow-lg transition duration-300 inline-flex items-center justify-center gap-3"
              >
                <GitHubLogoIcon className="w-5 h-5 text-indigo-600" />
                View on GitHub
              </a>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-zinc-500 font-mono">
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-blue-500" />
                No External Calls
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                Open Source
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                15 KB Frontend
              </span>
            </div>
          </div>

          {/* Window mockup with GIF */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-100/50 dark:bg-zinc-900/50">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs text-slate-500 dark:text-zinc-500 font-mono">
                    Oocak Fullscreen Slider — Live Preview
                  </span>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center p-4">
                <img
                  src="/gif-files/topdown-slider.gif"
                  alt="oocak fullscreen slider demo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
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

      {/* Features */}
      <section id="features" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-2">
            Everything You Need, Nothing You Don't
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto mt-4">
            A focused tool for one job. No page builders, no jQuery, no bloat.
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
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400">
                          {cat.risk}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-100 dark:bg-zinc-950 border-y border-slate-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mx-auto mb-4">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                No External Calls
              </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400">
                Every asset is bundled in the plugin. Nothing phones home. No
                analytics, no tracking, no third-party services.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mx-auto mb-4">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Security First
              </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400">
                Whitelist sanitization on every field, nonce verification on
                every write, capability checks on every admin action.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mx-auto mb-4">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Free Forever
              </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400">
                GPL-2.0 licensed. No pro version, no upsells, no feature gating.
                Use it on as many sites as you want.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="demo" className="py-24 max-w-6xl mx-auto px-6 text-center">
        <div className="p-16 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 border border-blue-500/30 shadow-2xl shadow-blue-500/20 space-y-6">
          <h2 className="text-3xl md:text-5xl font-black text-white">
            Ship a Full-Screen Landing Page
          </h2>
          <p className="text-blue-200 max-w-xl mx-auto text-base">
            Install oocak fullscreen slider from WordPress.org, add your slides,
            and paste one shortcode. That's the whole workflow.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <a
              href="https://wordpress.org/plugins/oocak-fullscreen-slider/"
              className="bg-white hover:bg-zinc-100 text-zinc-900 font-bold px-8 py-4 rounded-xl shadow-lg transition duration-300 inline-flex items-center gap-3"
            >
              <Download className="w-5 h-5 text-blue-600" />
              Get it from WordPress.org
            </a>
            <a
              href="https://github.com/OzanOcak/oocak-fullscreen-slider"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border border-white/30 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-xl transition duration-300 inline-flex items-center gap-3"
            >
              <GitHubLogoIcon className="w-5 h-5" />
              View Source
            </a>
          </div>
          <p className="text-xs text-blue-300/70 font-mono mt-4">
            v0.1.0 • WordPress 6.0+ • PHP 7.4+ • GPL-2.0
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <Layers className="w-6 h-6 text-blue-500" />
            <span className="font-bold text-slate-900 dark:text-white">
              oocak fullscreen slider
            </span>
          </div>

          <div className="flex gap-6 text-sm text-slate-500 dark:text-zinc-500">
            <a
              href="https://github.com/OzanOcak/oocak-fullscreen-slider"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://wordpress.org/plugins/oocak-fullscreen-slider/"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              WordPress.org
            </a>
            <a
              href="https://www.gnu.org/licenses/gpl-2.0.html"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              GPL-2.0
            </a>
          </div>

          <div className="text-xs font-mono text-slate-400 dark:text-zinc-600">
            © {new Date().getFullYear()} oocak fullscreen slider. Made by Ozan
            Ocak.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
