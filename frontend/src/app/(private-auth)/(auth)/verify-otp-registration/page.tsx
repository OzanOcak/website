"use client";
import { useEffect, useState } from "react";
import { useCountdown } from "@/hooks/forgotten-password/useCountDown";
import { useOtpVerifyRegistration } from "@/hooks/auth/useOtpVerifyRegistration";
import { useRouter } from "next/navigation";

export default function OtpRequestPageForRegistration() {
  const mutation = useOtpVerifyRegistration();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const initialTimeLeft = 255; // 5 minute -5 secs (incase of latency)
  const { timeLeft, countdownFinished, handleCountdownFinish } =
    useCountdown(initialTimeLeft);
  const router = useRouter();

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
    console.log("OTP String:", otpString); // Log the constructed OTP
    if (otpString.length === 6 && otp.every((digit) => digit !== "")) {
      setLoading(true);
      console.log("OTP String to submit:", otpString); // Add this line
      console.log("Loading started"); // Add this line

      mutation.mutate(otpString, {
        onSuccess: () => {
          setLoading(false);
          console.log("OTP verified successfully!");
        },
        onError: (error: Error) => {
          setLoading(false);
          alert(`Error: ${error.message}`); // Show an error message
        },
      });
    } else {
      alert("Please enter a complete OTP."); // Alert if not all inputs are filled
    }
  };

  useEffect(() => {
    if (countdownFinished) {
      handleCountdownFinish();
    }
  }, [countdownFinished, handleCountdownFinish]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <section className="w-full max-w-md">
        <div className="mb-8 flex flex-col gap-2 items-center">
          <h1 className="text-4xl font-semibold text-center">Verify OTP</h1>
          <p
            className={`text-lg ${
              timeLeft <= 60 ? "text-red-500" : "text-blue-500"
            } mt-2`}
          >
            Time left: {Math.floor(timeLeft / 60)}:
            {String(timeLeft % 60).padStart(2, "0")}
          </p>
        </div>
        <div className="flex justify-between space-x-2">
          {otp.map((_, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              autoComplete="off"
              maxLength={1}
              className="w-12 h-12 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={otp[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onFocus={(e) => e.target.select()} // Select the input on focus
            />
          ))}
        </div>
        {countdownFinished ? (
          <button
            onClick={() => {
              localStorage.removeItem("xg8a");
              localStorage.removeItem("countdownFinished");
              router.push("/forgot-password");
            }}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Back to Password Request
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        )}
        {countdownFinished && (
          <p className="text-red-500 text-sm mt-2">
            Time is up! Please try again.
          </p>
        )}
      </section>
    </main>
  );
}
