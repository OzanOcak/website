---
title: Implementing LocalStorage to Tauri with Zustand:
slug: c-programming-tutorial
description: Implementing Theme Switching in Tauri: From Buttons to Zustand Persistence
imageUrl: /images/12.png
author: o. ocak
date: 19.09.2024
tags:
  - Zustand
  - Tauri
published: true
---

# Implementing Theme Switching in Tauri: From Buttons to Zustand Persistence (and Beyond!)

Building upon my previous exploration of theme switching in Tauri, I'm excited to share some further refinements and insights gained. We'll delve into explicit permission handling, component extraction, and the importance of database location.

## Explicit Permissions: Ensuring Robust Security

In my initial setup, I relied on the "store:default" permission in capabilities/default.json. While this works, it grants all store plugin operations. For enhanced security, it's best to specify only the permissions your application truly needs.

After running npm run tauri add store, and modifying my capabilities/default.json I have these permissions:

```JSON

"permissions": [
  "store:default",
  "store:allow-get",
  "store:allow-set",
  "store:allow-save",
  "store:allow-load",
  "store:allow-reset",
  "store:allow-entries"
]
```

This approach adheres to the principle of least privilege, minimizing potential security risks.

## Button fro switching theme

To improve code organization and reusability, I extracted the theme switch button into a separate component, ThemeSwitchButton.tsx:

```tsx
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

interface ThemeSwitchButtonProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const ThemeSwitchButton: React.FC<ThemeSwitchButtonProps> = ({
  theme,
  toggleTheme,
}) => {
  // ... component implementation ...
};
```

This separation of concerns makes the MainLayout component cleaner and easier to maintain.

## Database Location: A Key Consideration

Initially, my database file was located within the src-tauri directory. However, this caused issues during development due to Tauri's hot reloading and build process. I had to run `cargo sqlx prepare --database-url sqlite:/database.db` everytime within src-tauri folder To address this, I moved the database file to a data directory at the root of my project.
Note thatI can only execute cargo under src-tauri/ folder since cargo.toml located there.

```markdown
my-project/
├── package.json
├── src/
│ └── main.tsx
├── src-tauri/
│ └──src/main.rs
└── data/
└── database.db
```

This ensures that the database file is not affected by the build process and provides a clear separation of concerns.

## Zustand and Tauri Store Integration: A Refined Approach

My useAppStore.ts file went through several iterations to ensure proper store initialization and error handling. The core logic now revolves around the initializeStore function, which loads the store using load from @tauri-apps/plugin-store:

```tsx
import { create } from "zustand";
import { load, Store } from "@tauri-apps/plugin-store";
import { immer } from "zustand/middleware/immer";
import {
  subscribeWithSelector,
  persist,
  PersistStorage,
  StorageValue,
} from "zustand/middleware";
import { createThemeSlice, ThemeSlice } from "./themeSlice";

// ... type definitions and constants ...

let initializedStore: Store | null = null;

const initializeStore = async (): Promise<Store> => {
  if (initializedStore) {
    return initializedStore;
  }
  initializedStore = await load(STORAGE_FILE);
  return initializedStore;
};

// ... customStorage implementation ...

export const useAppStore = create<AppStore>()(
  persist(
    subscribeWithSelector(
      immer((set, get, api) => {
        return {
          ...createThemeSlice(set, get, api),
        };
      })
    ),
    {
      name: "state",
      storage: customStorage,
    }
  )
);

// ... loadStore implementation ...

export { loadStore };
export default useAppStore;
```

## Key Takeaways:

Explicit Permissions: Always specify the minimum required permissions for your Tauri plugins.
Component Extraction: Break down your UI into reusable components for better maintainability.
Database Location: Keep your database files outside of your source code directories.
Zustand and Tauri Store: Use load from @tauri-apps/plugin-store for reliable store initialization.
cargo sqlx prepare: Run this command when changing the database schema.
