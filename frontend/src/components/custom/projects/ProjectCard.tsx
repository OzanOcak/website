// components/custom/projects/ProjectCard.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppIcon } from "@/components/icons/App-Icon";

interface ProjectCardProps {
  title: string;
  desc: string;
  tag: string;
  icon: string;
  metrics: string;
  path: string;
  color?: "emerald" | "indigo" | "purple" | "blue" | "amber" | "green";
  className?: string;
}

const colorMap = {
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-500",
    hover: "hover:border-emerald-500/60",
    arrow: "text-emerald-500",
  },
  indigo: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    text: "text-indigo-500",
    hover: "hover:border-indigo-500/60",
    arrow: "text-indigo-500",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-500",
    hover: "hover:border-purple-500/60",
    arrow: "text-purple-500",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-500",
    hover: "hover:border-blue-500/60",
    arrow: "text-blue-500",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-500",
    hover: "hover:border-amber-500/60",
    arrow: "text-amber-500",
  },
  green: {
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    text: "text-green-500",
    hover: "hover:border-green-500/60",
    arrow: "text-green-500",
  },
};

export const ProjectCard = ({
  title,
  desc,
  tag,
  icon,
  metrics,
  path,
  color = "emerald",
  className = "",
}: ProjectCardProps) => {
  const colors = colorMap[color];

  return (
    <Link
      href={path}
      className={`group p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm ${colors.hover} transition-all duration-300 flex flex-col justify-between ${className}`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div
            className={`w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center ${colors.text}`}
          >
            <AppIcon icon={icon} title={title} className="w-8 h-8" size="lg" />
          </div>
          <span className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-md">
            {tag}
          </span>
        </div>

        <h3
          className={`text-xl font-bold text-slate-900 dark:text-white group-hover:${colors.text} transition-colors`}
        >
          {title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {desc}
        </p>
      </div>

      <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
        <span className="text-xs font-mono text-slate-500">{metrics}</span>
        <ArrowRight
          className={`w-4 h-4 ${colors.arrow} group-hover:translate-x-1 transition-transform`}
        />
      </div>
    </Link>
  );
};
