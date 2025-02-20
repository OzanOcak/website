"use client";
import { Button } from "../../ui/button";
import { useRouter } from "next/navigation";

// Define a separate interface for SignIn props
interface SignInProps {
  onClose?: () => void; // Optional onClose prop
}

export const SignIn: React.FC<SignInProps> = ({ onClose }) => {
  const router = useRouter();

  const handleLogin = () => {
    if (onClose) {
      onClose(); // Call onClose if it is provided
    }
    router.push("/login"); // Navigate to the login page
  };

  return (
    <Button
      id="signin"
      variant="outline"
      onClick={handleLogin}
      className="text-gray-700 font-bold dark:text-gray-200 hover:bg-gray-200"
    >
      Sign in
    </Button>
  );
};
