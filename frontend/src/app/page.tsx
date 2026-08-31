"use client";

import { useIncreaseVisitCount } from "@/hooks/roles/visitcount/useIncreaseVisitCount";
import { useStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Languages,
  Code2,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from "lucide-react";

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

  const appShowcase = [
    {
      title: "Smart Words Dictionary",
      desc: "Offline-first vocabulary engine featuring 30,000+ words, spaced-repetition memory tracking, and exam practice modules.",
      path: "/apps/smartwords",
      tag: "iOS & Mobile",
      icon: BookOpen,
      metrics: "30k+ Words • 200k Questions",
    },
    {
      title: "Go French",
      desc: "Interactive language acquisition suite focused on real-world conversational patterns, grammar drills, and spaced recall.",
      path: "/apps/gofrench",
      tag: "Learning Engine",
      icon: Languages,
      metrics: "Grammar • Active Recall",
    },
    {
      title: "Frontend Pro",
      desc: "Targeted technical interview practice engine and interactive quizzes for modern web developers.",
      path: "/apps/frontendpro",
      tag: "Developer Tools",
      icon: Code2,
      metrics: "React • TypeScript • Web Architecture",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans antialiased">
      {/* Hero Section */}
      <section className="min-h-[85vh] flex items-center justify-center text-center px-4 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent">
        <div className="max-w-4xl mx-auto space-y-6">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {appShowcase.map((app, idx) => {
            const Icon = app.icon;
            return (
              <Link
                key={idx}
                href={app.path}
                className="group p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-emerald-500/60 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                      <Icon className="w-6 h-6" />
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
      </section>

      {/* Security & Architecture Highlight */}
      <section className="py-20 bg-slate-100 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Security & Local-First Principles
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            All applications are engineered with privacy-first standards, fast
            offline persistence using embedded local databases, and clean modern
            UI interfaces.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => router.push("/apps")}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md"
            >
              Browse All Projects
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
