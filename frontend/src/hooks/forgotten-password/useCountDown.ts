import { useState, useEffect } from "react";

interface CountdownState {
  timeLeft: number;
  countdownFinished: boolean;
  handleCountdownFinish: () => void;
}

export const useCountdown = (initialTimeLeft: number): CountdownState => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const storedTimeLeft = localStorage.getItem("timeLeft");
    const storedFinished = localStorage.getItem("countdownFinished");

    if (storedFinished === "true") {
      return 0; // If countdown finished, set timeLeft to 0
    }

    return storedTimeLeft ? parseInt(storedTimeLeft, 10) : initialTimeLeft;
  });

  const [countdownFinished, setCountdownFinished] = useState(() => {
    return localStorage.getItem("countdownFinished") === "true";
  });

  useEffect(() => {
    if (countdownFinished) return; // Exit if countdown is already finished

    const intervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft > 1) {
          const newTimeLeft = prevTimeLeft - 1;
          localStorage.setItem("timeLeft", String(newTimeLeft));
          return newTimeLeft;
        } else {
          // Countdown finished
          clearInterval(intervalId);
          setCountdownFinished(true);
          localStorage.setItem("countdownFinished", "true"); // Mark countdown as finished
          localStorage.removeItem("timeLeft"); // Optionally remove value from local storage
          return 0; // Ensure timeLeft is 0 when finished
        }
      });
    }, 1000);

    return () => {
      clearInterval(intervalId); // Cleanup interval on unmount
    };
  }, [countdownFinished]);

  const handleCountdownFinish = () => {
    setCountdownFinished(true);
  };

  return {
    timeLeft,
    countdownFinished,
    handleCountdownFinish,
  };
};
