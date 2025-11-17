import { themeStore } from "../store/theme.store";
import { defaultThemeId, themes, type ThemeDefinition } from "@/lib/themes";

function resolveTheme(themeId: string): ThemeDefinition {
  return themes.find((candidate) => candidate.id === themeId) ?? themes[0];
}

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

export function getThemeById(themeId: string): ThemeDefinition {
  return resolveTheme(themeId);
}

export function getThemes() {
  return themes;
}

export function applyThemeById(themeId: string) {
  applyTheme(resolveTheme(themeId));
}

export function syncThemeAction() {
  const { themeId, setProperty } = themeStore.getState();
  const theme = resolveTheme(themeId || defaultThemeId);

  if (theme.id !== themeId) {
    setProperty("themeId", theme.id);
  }

  applyTheme(theme);
  return theme;
}

export function setThemeAction(themeId: string) {
  const { setProperty } = themeStore.getState();
  const theme = resolveTheme(themeId || defaultThemeId);

  setProperty("themeId", theme.id);
  applyTheme(theme);
  return theme;
}
