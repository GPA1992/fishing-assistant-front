"use client";

import { useEffect } from "react";
import { applyThemeById, syncThemeAction, themeStore } from "@/core/theme";

export function ThemeInitializer() {
  useEffect(() => {
    syncThemeAction();

    const unsubscribe = themeStore.subscribe(
      (state) => state.themeId,
      (themeId) => applyThemeById(themeId)
    );

    const finishHydration = themeStore.persist?.onFinishHydration?.(() => {
      syncThemeAction();
    });

    return () => {
      unsubscribe();
      finishHydration?.();
    };
  }, []);

  return null;
}
