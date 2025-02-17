import SignupForm from "@/components/auth/signup";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center">
      <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center">Sign Up</h1>
          <p className="text-sm text-neutral-500 text-center mt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 underline underline-offset-4"
            >
              Login
            </Link>
          </p>
        </div>

        {/* Signup Form */}
        <SignupForm />
      </div>
    </div>
  );
}
