import PasswordUpdateForm from "@/components/auth/passwordUpdate";

export default function PasswordUpdatePage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900  flex flex-col justify-center items-center">
      <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center">Update Password</h1>
        </div>

        {/* Password Update Form */}
        <PasswordUpdateForm />
      </div>
    </div>
  );
}
