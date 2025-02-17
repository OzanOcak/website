"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  // Ensures that the component only mounts on the client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // If not mounted, return null to avoid hydration mismatch
  if (!mounted) {
    return null; // This prevents any output from being rendered on the server
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// npm i next-themes

/** Mounted State:
1. We use a local state mounted to track whether the component has been mounted in the client. 
This prevents any rendering on the server side until the client has fully mounted.
2. Return Null Before Mounting:
Before the component is mounted, we return null. 
This means that the server will render the HTML without the <ThemeProvider>, avoiding any discrepancies.
3. Client-Only Behavior:
Once the component mounts, it will display the theme correctly,
ensuring that the rendered output is consistent with the client. */
