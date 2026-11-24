"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { createWriteQueue, parseAppearance, STORAGE_KEYS } from "@/domain/storage";
import type { AppearancePreference } from "@/domain/types";

export const brand = {
  cream: "#FAF7F2",
  forest: "#275A4E",
  mint: "#A8D8C0",
  charcoal: "#181C1A",
} as const;

export type AppColors = {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  accent: string;
  mint: string;
  mintSoft: string;
  border: string;
  primary: string;
  onPrimary: string;
  control: string;
  onControl: string;
  track: string;
  progress: string;
  completedCard: string;
  danger: string;
  tabInactive: string;
  overlay: string;
};

export const lightColors: AppColors = {
  background: brand.cream,
  surface: "#FFFFFF",
  text: "#24312C",
  textMuted: "#6E7D76",
  accent: brand.forest,
  mint: brand.mint,
  mintSoft: "#E5F6EC",
  border: "#E6DFD4",
  primary: brand.forest,
  onPrimary: "#FFFFFF",
  control: brand.forest,
  onControl: "#FFFFFF",
  track: "#E3F0E8",
  progress: "#2F6B5C",
  completedCard: "#E7F6EE",
  danger: "#8E3B3B",
  tabInactive: "#7E9088",
  overlay: "rgba(24, 28, 26, 0.35)",
};

export const darkColors: AppColors = {
  background: brand.charcoal,
  surface: "#242A27",
  text: "#F4F1EA",
  textMuted: "#A8B4AE",
  accent: brand.mint,
  mint: brand.mint,
  mintSoft: "#2A3B34",
  border: "#343C38",
  primary: brand.mint,
  onPrimary: "#17352C",
  control: brand.mint,
  onControl: "#17352C",
  track: "#2C3833",
  progress: brand.mint,
  completedCard: "#243830",
  danger: "#F0B4B4",
  tabInactive: "#8FA099",
  overlay: "rgba(0, 0, 0, 0.55)",
};

type ThemeContextValue = {
  ready: boolean;
  preference: AppearancePreference;
  scheme: "light" | "dark";
  colors: AppColors;
  setPreference: (preference: AppearancePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<AppearancePreference>("system");
  const [ready, setReady] = useState(false);
  const enqueue = useRef(createWriteQueue()).current;

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.appearance);
        const stored = parseAppearance(raw);
        if (active && stored) setPreferenceState(stored);
      } catch {
        // Si la lectura falla, se queda el valor por defecto sin pisar el almacenamiento.
      } finally {
        if (active) setReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const setPreference = useCallback(
    (next: AppearancePreference) => {
      setPreferenceState(next);
      enqueue(() => AsyncStorage.setItem(STORAGE_KEYS.appearance, next));
    },
    [enqueue],
  );

  const scheme: "light" | "dark" =
    preference === "system" ? (systemScheme === "dark" ? "dark" : "light") : preference;
  const colors = scheme === "dark" ? darkColors : lightColors;

  const value = useMemo(
    () => ({ ready, preference, scheme, colors, setPreference }),
    [ready, preference, scheme, colors, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useAppTheme tiene que usarse dentro de AppThemeProvider");
  return value;
}
