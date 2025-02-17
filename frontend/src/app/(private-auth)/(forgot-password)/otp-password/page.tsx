import { useEffect, useState, useRef } from "react";
import { useOtpVerify } from "@/hooks/forgotten-password/useOtpVerify";
import { useCountdown } from "@/hooks/forgotten-password/useCountDown";
import { useRouter } from "next/navigation";

export default function OtpRequestPage() {
  const mutation = useOtpVerify();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const initialTimeLeft = 255; // 5 minutes - 5 seconds (in case of latency)
  const { timeLeft, countdownFinished, handleCountdownFinish } =
    useCountdown(initialTimeLeft);
  const router = useRouter();

  // Create a ref for the first OTP input field
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus on the first OTP input field when the component mounts
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1); // Ensure only single character input

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }

    setOtp(newOtp);
  };

  const handleSubmit = async () => {
    if (countdownFinished) {
      alert("Time's up! Please try again.");
      return;
    }

    const otpString = otp.join("");
    if (otpString.length === 6 && otp.every((digit) => digit !== "")) {
      setLoading(true);
      mutation.mutate(otpString, {
        onSuccess: () => {
          setLoading(false);
          console.log("OTP verified successfully!");
        },
        onError: (error: Error) => {
          setLoading(false);
          alert(`Error: ${error.message}`);
        },
      });
    } else {
      alert("Please enter a complete OTP.");
    }
  };

  useEffect(() => {
    if (countdownFinished) {
      handleCountdownFinish();
    }
  }, [countdownFinished, handleCountdownFinish]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center">Verify OTP</h1>
          <p
            className={`text-lg ${
              timeLeft <= 60 ? "text-red-500" : "text-blue-500"
            } mt-2 text-center`}
          >
            Time left: {Math.floor(timeLeft / 60)}:
            {String(timeLeft % 60).padStart(2, "0")}
          </p>
        </div>

        {/* OTP Input Fields */}
        <div className="flex justify-between space-x-2">
          {otp.map((_, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength={1}
              className="w-12 h-12 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={otp[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onFocus={(e) => e.target.select()}
              ref={index === 0 ? firstInputRef : null} // Attach ref to the first input
            />
          ))}
        </div>

        {/* Submit Button */}
        {countdownFinished ? (
          <button
            onClick={() => {
              localStorage.removeItem("xg8a");
              localStorage.removeItem("countdownFinished");
              router.push("/forgot-password");
            }}
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Back to Password Request
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        )}

        {/* Error Message */}
        {countdownFinished && (
          <p className="text-red-500 text-sm mt-4 text-center">
            Time is up! Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
