/* eslint-disable react/jsx-key */
"use client";

import React, { useState } from "react";
import {
  Shield,
  Key,
  Lock,
  Server,
  Cloud,
  Database,
  Globe,
  Terminal,
  Menu,
  X,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Network,
  BookOpen,
  Github,
  ExternalLink,
  Layers,
  Zap,
} from "lucide-react";
import Link from "next/link";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      title: "End-to-End JWT Security",
      desc: "Stateless authentication using access/refresh tokens with token invalidation (token IDs). Secure cookie handling and Axios interceptor integration for seamless token renewal.",
      icon: Shield,
    },
    {
      title: "Multi-Layered Authentication",
      desc: "Time-based OTP (TOTP), email-based 2FA, customizable password policies, and brute-force protection.",
      icon: Lock,
    },
    {
      title: "User-Centric Authorization",
      desc: "Role and permission management inspired by OAuth's scope logic, enabling granular access control (e.g., user:read, admin:write).",
      icon: Key,
    },
    {
      title: "Modern Tech Stack",
      desc: "React + TypeScript, React Query, Zod, Express.js, Drizzle ORM, PostgreSQL. Fully containerized with Docker.",
      icon: Layers,
    },
  ];

  const architectureLayers = [
    {
      title: "Frontend (Vercel)",
      desc: "React + TypeScript application hosted on Vercel with global CDN and automatic SSL.",
      icon: Globe,
    },
    {
      title: "API Gateway (Cloudflare)",
      desc: "Cloudflare Tunnel securely exposes the Raspberry Pi without port forwarding.",
      icon: Cloud,
    },
    {
      title: "Backend (Raspberry Pi)",
      desc: "Express.js server running on Raspberry Pi with NGINX reverse proxy.",
      icon: Server,
    },
    {
      title: "Database (PostgreSQL)",
      desc: "PostgreSQL database hosted on the Raspberry Pi with Drizzle ORM.",
      icon: Database,
    },
  ];

  const stats = [
    { label: "Architecture Layers", value: "4" },
    { label: "Security Features", value: "8+" },
    { label: "Self-Hosted", value: "100%" },
    { label: "Open Source", value: "Yes" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-zinc-900 dark:text-zinc-100 font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-50/80 dark:bg-zinc-900/95 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 shadow-lg -mt-4">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Shield className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Auth
              <span className="text-indigo-500 dark:text-indigo-400">Flow</span>
            </span>
            <span className="hidden md:inline-flex ml-3 px-2.5 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-widest">
              ARCHITECTURE
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-zinc-400">
            <a
              href="#features"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#architecture"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Architecture
            </a>
            <a
              href="#blog"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Blog Posts
            </a>
            <a
              href="https://github.com/OzanOcak/website"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-all shadow-md shadow-indigo-500/20"
            >
              View on GitHub
            </a>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none"
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
              className="block text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 py-1 text-sm font-medium"
            >
              Features
            </a>
            <a
              href="#architecture"
              onClick={() => setIsMenuOpen(false)}
              className="block text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 py-1 text-sm font-medium"
            >
              Architecture
            </a>
            <a
              href="#blog"
              onClick={() => setIsMenuOpen(false)}
              className="block text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 py-1 text-sm font-medium"
            >
              Blog Posts
            </a>
            <a
              href="https://github.com/yourusername/authflow"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm"
            >
              View on GitHub
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-950/20 dark:to-transparent">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-mono text-indigo-600 dark:text-indigo-400">
              <Shield className="w-3.5 h-3.5" />
              OWASP Best Practices • Self-Hosted
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
              Secure Auth &amp;
              <br />
              <span className="bg-gradient-to-r from-indigo-500 to-indigo-700 bg-clip-text text-transparent">
                Scalable Architecture
              </span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-zinc-400 leading-relaxed max-w-xl">
              A robust authentication system built from scratch with JWT, MFA,
              and role-based access control. Complete with a self-hosted
              infrastructure using Raspberry Pi, Cloudflare, and Vercel.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href="https://github.com/yourusername/authflow"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-bold px-7 py-3.5 rounded-xl transition duration-300 shadow-lg shadow-indigo-500/25"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
              <Link
                href="https://oocak.com/blogpost/raspberry-pi-cloudflare-vercel-architecture"
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 hover:border-indigo-500/50 font-bold px-7 py-3.5 rounded-xl transition duration-300"
              >
                <BookOpen className="w-5 h-5" />
                Read Blog Post
              </Link>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-zinc-500 font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                JWT Security
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                MFA Support
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                Role-Based Access
              </span>
            </div>
          </div>

          {/* Architecture Diagram / GIF */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm shadow-2xl overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-100/50 dark:bg-zinc-900/50">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs text-slate-500 dark:text-zinc-500 font-mono">
                    Architecture — AuthFlow
                  </span>
                </div>
              </div>

              {/* GIF Container */}
              <div className="flex-1 flex items-center justify-center p-4">
                <img
                  src="/gif-files/auth.gif"
                  alt="AuthFlow Architecture"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="py-10 bg-gradient-to-r from-indigo-600 to-indigo-800 border-y border-indigo-500/30">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-1">
              <div className="text-3xl md:text-4xl font-black text-white">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
            Security Features
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-2">
            Built with Security in Mind
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto mt-4">
            A complete authentication system built from scratch with OWASP best
            practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all shadow-lg ${
                  idx === 0 ? "md:col-span-2" : ""
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
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

      {/* Architecture Section */}
      <section
        id="architecture"
        className="py-20 bg-slate-100 dark:bg-zinc-950 border-y border-slate-200 dark:border-zinc-800"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
              Infrastructure
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              Self-Hosted Architecture
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto mt-4">
              Raspberry Pi • Cloudflare Tunnels • Vercel • PostgreSQL
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {architectureLayers.map((layer, i) => {
              const Icon = layer.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {layer.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">
                    {layer.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Architecture Flow Diagram */}
          <div className="mt-12 p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-mono text-slate-600 dark:text-zinc-400">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                  <Globe className="w-5 h-5" />
                </div>
                <span>User</span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Zap className="w-5 h-5" />
                </div>
                <span>Vercel (Frontend)</span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                  <Cloud className="w-5 h-5" />
                </div>
                <span>Cloudflare Tunnel</span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                  <Cpu className="w-5 h-5" />
                </div>
                <span>Raspberry Pi</span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                  <Database className="w-5 h-5" />
                </div>
                <span>PostgreSQL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section id="blog" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
            Blog
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-2">
            Related Articles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/blog/secure-scalable-architecture-raspberry-pi-cloudflare-vercel"
            className="group p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-slate-500">
                  10.03.2025
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2 group-hover:text-indigo-500 transition-colors">
                  Building a Secure and Scalable Architecture with Raspberry Pi,
                  Cloudflare, and Vercel
                </h3>
                <p className="text-sm text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  A deep dive into self-hosting a full-stack application with
                  Raspberry Pi, Cloudflare Tunnels, and Vercel.
                </p>
              </div>
              <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
            </div>
          </Link>

          <Link
            href="/blog/authflow-authentication-authorization-system"
            className="group p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-slate-500">
                  Coming Soon
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2 group-hover:text-indigo-500 transition-colors">
                  Authentication & Authorization System
                </h3>
                <p className="text-sm text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  A complete guide to building a secure JWT-based auth system
                  with MFA, role-based access, and a self-hosted architecture.
                </p>
              </div>
              <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
            </div>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section id="github" className="py-24 max-w-6xl mx-auto px-6 text-center">
        <div className="p-16 rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-700 dark:to-indigo-900 border border-indigo-500/30 shadow-2xl shadow-indigo-500/20 space-y-6">
          <h2 className="text-3xl md:text-5xl font-black text-white">
            Explore the Code
          </h2>
          <p className="text-indigo-200 max-w-xl mx-auto text-base">
            Check out the complete authentication system on GitHub. Open source
            and ready to use.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/yourusername/authflow"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-zinc-100 text-zinc-900 font-bold px-8 py-4 rounded-xl shadow-lg transition duration-300 inline-flex items-center gap-3"
            >
              <Github className="w-5 h-5 text-indigo-600" />
              View on GitHub
            </a>
            <a
              href="/blog/secure-scalable-architecture-raspberry-pi-cloudflare-vercel"
              className="bg-zinc-900 hover:bg-black text-white font-bold px-8 py-4 rounded-xl shadow-lg transition duration-300 inline-flex items-center gap-3 border border-zinc-700"
            >
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Read the Blog
            </a>
          </div>
          <p className="text-xs text-indigo-300/70 font-mono mt-4">
            Built with React, Express, PostgreSQL • Self-Hosted on Raspberry Pi
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-indigo-500" />
            <span className="font-bold text-slate-900 dark:text-white">
              AuthFlow
            </span>
          </div>

          <div className="flex gap-6 text-sm text-slate-500 dark:text-zinc-500">
            <a
              href="#"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              GitHub
            </a>
            <a
              href="#"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Blog
            </a>
            <a
              href="#"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              MIT License
            </a>
          </div>

          <div className="text-xs font-mono text-slate-400 dark:text-zinc-600">
            © {new Date().getFullYear()} AuthFlow. Built with ❤️
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
