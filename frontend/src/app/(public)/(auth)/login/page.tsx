"use client";
import LoginForm from "@/components/auth/login";
//import { GoogleSignInButton } from "@/components/oauth/googleSignin";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.replace("/");
    // replace:true for one click
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md relative">
        {/* Go Back Icon (Top Left) */}
        <div
          className="absolute top-4 left-4 flex items-center cursor-pointer hover:text-blue-700 hover:scale-105 transition-transform duration-200"
          onClick={handleGoBack}
        >
          <FaArrowLeft className="text-blue-500 text-2xl" />
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
            Sign in
          </h1>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Forgot Password Link */}
        <div className="text-sm text-gray-500 mt-4 text-center dark:text-gray-400">
          <Link
            href="/forgot-password"
            className="hover:text-blue-500 dark:hover:text-blue-400"
          >
            Forgot your password?
          </Link>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        {/*
          <div className="flex justify-center">
            <GoogleSignInButton />
          </div>
        */}
      </div>
    </div>
  );
}
