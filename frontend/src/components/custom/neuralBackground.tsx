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

        // --- THE ROBUST LOGO REMOVAL ENGINE ---
        const purgeLogo = () => {
          // 1. Check for standard Light DOM link attached right next to or inside the canvas
          const externalLink = container.querySelector('a[href*="seinx"]');
          if (externalLink) externalLink.remove();

          // 2. Check if the element uses a Shadow DOM wrapper
          if (canvas.shadowRoot) {
            // Find any branding links or watermark divs inside the shadow tree
            const shadowLink =
              canvas.shadowRoot.querySelector('a[href*="seinx"]');
            if (shadowLink) shadowLink.remove();

            const shadowLogo = canvas.shadowRoot.querySelector(
              '[class*="logo"], [id*="logo"]',
            );
            if (shadowLogo) shadowLogo.remove();
          }
        };

        // Run immediately, then execute a minor polling check for delayed internal rendering
        purgeLogo();
        const purgeInterval = setInterval(purgeLogo, 100);
        setTimeout(() => clearInterval(purgeInterval), 2000);
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
      className={`relative overflow-hidden min-h-screen w-full ${className}`}
      style={{
        position: "relative",
      }}
    >
      <div className="relative z-10 w-full min-h-screen">{children}</div>
    </div>
  );
};
