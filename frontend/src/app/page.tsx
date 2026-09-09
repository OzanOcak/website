"use client";

import { useIncreaseVisitCount } from "@/hooks/roles/visitcount/useIncreaseVisitCount";
import { useStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { AppIcon } from "@/components/icons/App-Icon";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function Home() {
  const visited = useStore.getState().visited;
  const setVisited = useStore.getState().setVisited;

  const { mutate: increaseVisitCount } = useIncreaseVisitCount();
  const router = useRouter();

  useEffect(() => {
    const trackVisit = async () => {
      if (!visited) {
        try {
          await increaseVisitCount();
          console.log("Visit tracked successfully");
          setVisited(true);
        } catch (error) {
          console.error("Error tracking visit:", error);
        }
      }
    };

    trackVisit();
  }, [visited, setVisited, increaseVisitCount]);

  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  const appShowcase = {
    mobile: [
      {
        title: "Smart Words Dictionary",
        desc: "Offline-first vocabulary engine featuring 30,000+ words, spaced-repetition memory tracking, and exam practice modules.",
        path: "/apps/smartwords",
        tag: "iOS & Mobile",
        icon: "/app-icons/smart_words.webp",
        metrics: "30k+ Words • 200k Questions",
      },
      {
        title: "Go French",
        desc: "Interactive language acquisition suite focused on real-world conversational patterns, grammar drills, and spaced recall.",
        path: "/apps/gofrench",
        tag: "iOS & Mobile",
        icon: "/app-icons/gofrench.webp",
        metrics: "Grammar • Active Recall",
      },
      {
        title: "Frontend Pro",
        desc: "Targeted technical interview practice engine and interactive quizzes for modern web developers.",
        path: "/apps/frontendpro",
        tag: "iOS & Mobile",
        icon: "/app-icons/frontend_pro.webp",
        metrics: "React • TypeScript • Web Architecture",
      },
    ],
    desktop: [
      {
        title: "PixelShrink",
        desc: "Visually lossless image compression with metadata purging and high-ratio quantization. Built with Rust and Tauri.",
        path: "/apps/pixelshrink",
        tag: "Desktop App",
        icon: "/app-icons/pixel_shrink.webp",
        metrics: "Rust • Tauri • 80x Compression",
      },
      {
        title: "Mac Cleaner for Devs",
        desc: "Scan and delete developer caches, build artifacts, simulator data, and dependency folders. Privacy first, no uploads.",
        path: "/apps/maccleaner",
        tag: "Desktop App",
        icon: "/app-icons/mac_cleaner.webp",
        metrics: "Rust • Tauri • React",
      },
      {
        title: "Markle",
        desc: "Powerful Markdown editor with VSCode-like explorer, LaTeX, Mermaid, and multiple export formats. Built with Electron.",
        path: "/apps/markle",
        tag: "Desktop Editor",
        icon: "/app-icons/markle.webp",
        metrics: "Electron • React • SQLite",
      },
    ],
    architecture: [
      {
        title: "AuthFlow",
        desc: "A complete authentication and authorization system built from scratch with JWT security, MFA, and role-based access control. Self-hosted on Raspberry Pi with Cloudflare Tunnels. Built for learning, stable enough for production.",
        path: "/apps/authflow",
        tag: "Architecture & Security",
        icon: "/app-icons/authflow.webp",
        metrics: "JWT • MFA • Self-Hosted",
      },
    ],
  };

  return (
    <main className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans antialiased -mt-4">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center text-center px-4 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent overflow-hidden">
        {" "}
        {/* Particles - Only inside this section */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
              fullScreen: {
                enable: false, // THIS IS THE KEY
              },
              background: {
                color: { value: "transparent" },
              },
              fpsLimit: 60,
              interactivity: {
                events: {
                  onHover: {
                    enable: true,
                    mode: "repulse",
                  },
                },
              },
              particles: {
                color: { value: "#10b981" },
                links: {
                  color: "#10b981",
                  distance: 150,
                  enable: true,
                  opacity: 0.2,
                  width: 1,
                },
                move: {
                  enable: true,
                  speed: 1.5,
                  direction: "none",
                  random: false,
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                    area: 800,
                  },
                  value: 60,
                },
                opacity: {
                  value: 0.4,
                },
                size: {
                  value: { min: 1, max: 3 },
                },
              },
              detectRetina: true,
            }}
            className="w-full h-full"
          />
        </div>
        {/* Content - sits on top */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-mono text-emerald-600 dark:text-emerald-400">
            <Cpu className="w-3.5 h-3.5 animate-pulse" /> Local-First &
            Developer Ecosystem
          </div>

          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            High-Performance Apps & <br />
            <span className="text-emerald-500">Developer Tools</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Exploring software engineering, local-first architecture, offline
            vocabulary engines, and modern frontend platforms.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <a
              href="#featured-apps"
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg shadow-emerald-500/20 transition duration-300"
            >
              Explore Applications
            </a>
            <button
              onClick={() => router.push("/apps")}
              className="w-full sm:w-auto bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-500 font-semibold py-3.5 px-8 rounded-xl transition duration-300"
            >
              All Software
            </button>
          </div>
        </div>
      </section>

      {/* Featured Apps Showcase Section */}
      <section id="featured-apps" className="py-20 max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-500 uppercase tracking-wider">
              Software Catalog
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              Featured Applications
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mt-2 md:mt-0">
            Dedicated applications designed for speed, privacy, and long-term
            utility.
          </p>
        </div>

        {/* Mobile Apps Row */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-emerald-500 rounded-full" />
            <h3 className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Mobile Apps
            </h3>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
              iOS • Offline-First
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {appShowcase.mobile.map((app, idx) => {
              return (
                <Link
                  key={idx}
                  href={app.path}
                  className="group p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-emerald-500/60 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                        <AppIcon
                          icon={app.icon}
                          title={app.title}
                          className="w-8 h-8"
                          size="lg"
                        />
                      </div>
                      <span className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-md">
                        {app.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                      {app.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {app.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500">
                      {app.metrics}
                    </span>
                    <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Desktop Apps Row */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-purple-500 rounded-full" />
            <h3 className="text-sm font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              Desktop Apps
            </h3>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
              Tauri • Electron • Rust
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {appShowcase.desktop.map((app, idx) => {
              return (
                <Link
                  key={idx}
                  href={app.path}
                  className="group p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-purple-500/60 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                        <AppIcon
                          icon={app.icon}
                          title={app.title}
                          className="w-8 h-8"
                          size="lg"
                        />
                      </div>
                      <span className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-md">
                        {app.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">
                      {app.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {app.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500">
                      {app.metrics}
                    </span>
                    <ArrowRight className="w-4 h-4 text-purple-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security & Architecture Highlight */}
      <section className="py-20 bg-slate-100 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 mx-auto flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Security, Architecture & Infrastructure
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            From self-hosted authentication systems to scalable infrastructure
            with Raspberry Pi, Cloudflare Tunnels, and Vercel — all applications
            are engineered with privacy-first standards and modern architecture.
          </p>

          {/* AuthFlow Featured Card */}
          <div className="max-w-2xl mx-auto mt-8">
            <Link
              href="/apps/authflow"
              className="group block p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-indigo-500/60 transition-all duration-300 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
                  <Shield className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                      AuthFlow
                    </h3>
                    <span className="text-[10px] font-mono bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md">
                      Architecture & Security
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    A complete authentication system built from scratch with JWT
                    security, MFA, role-based access, and a self-hosted
                    infrastructure.
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs font-mono text-slate-500 dark:text-slate-500">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      JWT Security
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      MFA Support
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Self-Hosted
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-transform group-hover:translate-x-1 shrink-0" />
              </div>
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/apps/authflow"
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md shadow-indigo-500/20"
            >
              Explore AuthFlow
            </Link>
            <Link
              href="/apps"
              className="bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-500 font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              Browse All Projects
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
