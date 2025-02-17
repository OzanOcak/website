import React from "react";
//import { Navigation } from "./navigation";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {/*
        <header className="bg-cream py-1.5 md:px-4 lg:px-16 shadow-md h-20">
          <Navigation />
        </header>
      */}
      <main className="flex min-h-screen flex-col items-center justify-between">
        <section className="w-full max-w-5xl px-2 md:px-4 lg:px-8 mt-2">
          <div className="bg-white dark:bg-gray-800 p-2 md:p-4 lg:p-8 rounded-lg shadow-md w-full relative flex items-center justify-center">
            {children}
          </div>
        </section>
      </main>
    </>
  );
};

export default Layout;
