//"use cache";
"use client";
import { useIncreaseVisitCount } from "@/hooks/roles/visitcount/useIncreaseVisitCount";
import { useStore } from "@/stores/useAuthStore";
import { useEffect } from "react";

//export const revalidate = 60;

export default function Home() {
  const visited = useStore.getState().visited;
  const setVisited = useStore.getState().setVisited;

  const { mutate: increaseVisitCount } = useIncreaseVisitCount();

  useEffect(() => {
    const trackVisit = async () => {
      if (!visited) {
        try {
          await increaseVisitCount(); // Call the mutate function
          console.log("Visit tracked successfully");
          setVisited(true);
        } catch (error) {
          console.error("Error tracking visit:", error);
        }
      }
    };

    trackVisit();
  }, [visited, setVisited, increaseVisitCount]);

  return (
    <main className="mt-[-1rem] bg-gray-100 dark:bg-gray-900">
      {/* Hero Section - Full Screen Height */}
      <section className="h-screen flex items-center justify-center text-center bg-gray-200 text-gray-900 dark:bg-black dark:text-gray-100">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            A <span className="text-green-500">Tech Blog</span> for App
            Development
          </h1>
          <p className="text-lg md:text-xl text-gray-800 dark:text-gray-300 mb-8">
            Open source blog and templates to empower developers worldwide.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
              Get Started
            </button>
            <button className="bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            About Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Web Development Card */}
            <div className="bg-gray-300 dark:bg-gray-800 p-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold mb-4">Web Development</h3>
              <p className="text-gray-800 dark:text-gray-300 mb-6">
                Building robust, scalable, and responsive web applications.
              </p>
              <a
                href="#"
                className="text-green-500 hover:text-green-400 flex items-center"
              >
                Learn More
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </a>
            </div>

            {/* Mobile Development Card */}
            <div className="bg-gray-300 dark:bg-gray-800 p-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold mb-4">Mobile Development</h3>
              <p className="text-gray-800 dark:text-gray-300 mb-6">
                Crafting seamless mobile experiences for both Android and iOS
              </p>
              <a
                href="#"
                className="text-green-500 hover:text-green-400 flex items-center"
              >
                Learn More
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </a>
            </div>

            {/* Cloud Solutions Card */}
            <div className="bg-gray-300 dark:bg-gray-800 p-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold mb-4">
                Desktop Applications
              </h3>
              <p className="text-gray-800 dark:text-gray-300 mb-6">
                Building robust, scalable, and responsive web applications.
              </p>
              <a
                href="#"
                className="text-green-500 hover:text-green-400 flex items-center"
              >
                Learn More
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Web Security Section - Text Block */}
      <section
        className="bg-gradient-to-r from-green-600 to-gray-100 via-gray-100 py-32 my-24
       dark:from-green-600 dark:to-gray-900 dark:via-gray-900"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Secure Your Web Applications
          </h2>
          <p className="text-lg text-gray-900 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            In today is digital world, web security is more important than ever.
            Protect your applications from vulnerabilities, data breaches, and
            cyber threats with best practices and cutting-edge tools.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
              Learn More
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
              Get Started
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

//export const dynamic = "force-static";
