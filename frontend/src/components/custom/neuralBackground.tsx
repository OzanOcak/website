// components/NeuralBackground.tsx
"use client";

import { ReactNode, useEffect, useRef } from "react";

interface NeuralBackgroundProps {
  children: ReactNode;
  className?: string;
}

export const NeuralBackground = ({
  children,
  className = "",
}: NeuralBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadNeuralCanvas = async () => {
      if (typeof window === "undefined") return;

      try {
        await import("seinx-nn-canvas-animation");

        const container = containerRef.current;
        if (!container) return;

        const existing = container.querySelector("neural-canvas");
        if (existing) existing.remove();

        const canvas = document.createElement("neural-canvas");
        canvas.setAttribute("id", "neural-bg");
        canvas.setAttribute(
          "style",
          "position: absolute; inset: 0; z-index: 0; pointer-events: none; width: 100%; height: 100%; opacity: 0.3;",
        );

        container.prepend(canvas);
      } catch (error) {
        console.error("Failed to load neural canvas:", error);
      }
    };

    loadNeuralCanvas();

    return () => {
      const container = containerRef.current;
      if (container) {
        const existing = container.querySelector("neural-canvas");
        if (existing) existing.remove();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};
