import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { customStorage } from "@/core/request/common";
import { defaultThemeId } from "@/lib/themes";

type State = {
  themeId: string;
};

const initial: State = {
  themeId: defaultThemeId,
};

type Actions = {
  setProperty: <K extends keyof State>(k: K, v: State[K]) => void;
  reset: () => void;
};

export const themeStore = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        ...initial,
        setProperty: (k, v) => set((state) => ({ ...state, [k]: v })),
        reset: () => set(initial),
      }),
      {
        name: "themeStore",
        storage: createJSONStorage(() => customStorage),
      }
    )
  )
);
