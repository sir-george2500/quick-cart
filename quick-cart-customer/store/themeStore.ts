/**
 * Theme Store
 * Manages app theme (light/dark mode) with persistence
 */

import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance, ColorSchemeName } from "react-native";

const THEME_KEY = "app_theme";

type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  mode: ThemeMode;
  colorScheme: ColorSchemeName;

  // Actions
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  loadTheme: () => Promise<void>;
}

const getSystemColorScheme = (): ColorSchemeName => {
  return Appearance.getColorScheme() || "light";
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: "system",
  colorScheme: getSystemColorScheme(),

  setMode: async (mode) => {
    const colorScheme = mode === "system" ? getSystemColorScheme() : mode;
    set({ mode, colorScheme });
    await AsyncStorage.setItem(THEME_KEY, mode);
    console.log("[ThemeStore] Theme set to:", mode, "->", colorScheme);
  },

  toggleTheme: async () => {
    const { colorScheme } = get();
    const newMode = colorScheme === "dark" ? "light" : "dark";
    await get().setMode(newMode);
  },

  loadTheme: async () => {
    try {
      const savedMode = await AsyncStorage.getItem(THEME_KEY);
      if (
        savedMode &&
        (savedMode === "light" ||
          savedMode === "dark" ||
          savedMode === "system")
      ) {
        const colorScheme =
          savedMode === "system" ? getSystemColorScheme() : savedMode;
        set({ mode: savedMode, colorScheme });
        console.log("[ThemeStore] Loaded theme:", savedMode, "->", colorScheme);
      }
    } catch (error) {
      console.error("[ThemeStore] Failed to load theme:", error);
    }
  },
}));
