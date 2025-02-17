import PasswordRequestForm from "@/components/auth/passwordRequest";

export default function PasswordRequestPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center">
      <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center">
            Request Password Reset
          </h1>
        </div>

        {/* Password Request Form */}
        <PasswordRequestForm />
      </div>
    </div>
  );
}
