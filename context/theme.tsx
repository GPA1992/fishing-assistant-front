"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultThemeId, themes, type ThemeDefinition } from "@/lib/themes";

type ThemeContextValue = {
  theme: ThemeDefinition;
  setThemeId: (id: string) => void;
  themes: ThemeDefinition[];
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: ThemeDefinition) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const vars: Record<string, string> = {
    "--color-background": theme.colors.background,
    "--color-surface": theme.colors.surface,
    "--color-surface-muted": theme.colors.surfaceMuted,
    "--color-border": theme.colors.border,
    "--color-text": theme.colors.text,
    "--color-muted": theme.colors.muted,
    "--color-primary": theme.colors.primary,
    "--color-primary-strong": theme.colors.primaryStrong,
    "--color-accent": theme.colors.accent,
    "--color-accent-strong": theme.colors.accentStrong,
    "--color-highlight": theme.colors.highlight,
    "--color-gradient-1": theme.colors.gradient[0],
    "--color-gradient-2": theme.colors.gradient[1],
    "--color-gradient-3": theme.colors.gradient[2],
  };

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState(defaultThemeId);

  const theme = useMemo(
    () => themes.find((candidate) => candidate.id === themeId) ?? themes[0],
    [themeId],
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const value = useMemo(
    () => ({ theme, setThemeId, themes }),
    [theme, setThemeId],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
