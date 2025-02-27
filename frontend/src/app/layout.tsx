import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import NavBar from "@/components/custom/navigation/NavBar";
import SiteConfig from "@/config/site";
import { QueryClient } from "@tanstack/react-query";
import { Providers } from "../components/custom/providers";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: SiteConfig.title,
  description: SiteConfig.description,
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 5, // default 3 trries if query failed
      refetchOnWindowFocus: false, // deafault:true, when the brrowser tab visited, it is refreshed
      //staleTime: 5 * 60 * 1000, // default:0 it define how long data will be fresh which means will be fetched in any change
      refetchOnMount: false, // defult:true, by making it false, it will not change while components unmounted or mounted
      // when react-router nav tabs switch components inmounted and mounted
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-p-20 scroll-smooth">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers>
          <div className="mb-4">
            <NavBar />
          </div>
          {children}
          {/* Footer */}
          <footer className="bg-gary-100 dark:bg-gray-900 py-8 text-center">
            <p className="dark:text-gray-400">
              © 2025 OOTech Blog. All rights reserved.
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
