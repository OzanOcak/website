"use client";
import Layout from "@/components/custom/layout";
import Link from "next/link";
import { FaNewspaper, FaUserCircle, FaChevronRight } from "react-icons/fa";

const cards = [
  {
    href: "/articles",
    title: "Articles",
    description: "Browse, read, and manage all published articles.",
    icon: FaNewspaper,
    accent: "blue",
  },
  {
    href: "/profile",
    title: "Profile",
    description: "View and update your account information.",
    icon: FaUserCircle,
    accent: "emerald",
  },
] as const;

const accentClasses = {
  blue: {
    ring: "hover:ring-blue-400 dark:hover:ring-blue-500",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    icon: "text-blue-600 dark:text-blue-400",
    arrow: "text-blue-500",
  },
  emerald: {
    ring: "hover:ring-emerald-400 dark:hover:ring-emerald-500",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    icon: "text-emerald-600 dark:text-emerald-400",
    arrow: "text-emerald-500",
  },
} as const;

export default function UserDashboardPage() {
  return (
    <Layout>
      <div className="mt-8 w-full max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Welcome back
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            What would you like to do today?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map(({ href, title, description, icon: Icon, accent }) => {
            const c = accentClasses[accent];
            return (
              <Link
                key={href}
                href={href}
                className={`group relative flex flex-col justify-between rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${c.ring} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${c.iconBg}`}
                  >
                    <Icon className={`w-6 h-6 ${c.icon}`} />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {description}
                  </p>
                </div>

                <div className="flex items-center justify-end mt-6 text-sm font-medium">
                  <span className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors">
                    Open
                  </span>
                  <FaChevronRight
                    className={`ml-1 w-3 h-3 transition-transform duration-200 group-hover:translate-x-1 ${c.arrow}`}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
