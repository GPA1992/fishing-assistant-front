"use client";

import { useEffect } from "react";
import { applyThemeById, syncThemeAction, themeStore } from "@/core/theme";

export function ThemeInitializer() {
  useEffect(() => {
    syncThemeAction();

    const unsubscribe = themeStore.subscribe((state, prevState) => {
      if (state.themeId !== prevState.themeId) {
        applyThemeById(state.themeId);
      }
    });

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
