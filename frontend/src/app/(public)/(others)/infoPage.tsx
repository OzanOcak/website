import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const InfoPage: React.FC = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/"); // Redirect to the home page
  };

  return (
    <div className="flex flex-col items-center justify-center  h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-center text-6xl font-bold text-green-600">
        Registration Successful!
      </h1>
      <h2 className="mt-4 text-2xl font-semibold">Activate Your Account</h2>
      <p className="mt-2 text-gray-600">
        A verification email has been sent to your email address. Please check
        your inbox and follow the instructions to activate your account.
      </p>
      <p className="mt-2 text-gray-600">
        If you do not see the email in your inbox, please check your spam folder
        or try resending the verification email.
      </p>
      <Button onClick={handleGoHome} className="mt-6">
        Go to Home
      </Button>
    </div>
  );
};

export default InfoPage;
