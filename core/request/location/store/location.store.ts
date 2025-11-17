import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { customStorage } from "../../common";
import { type LocationSearchResult, type LocationSelection } from "../types";

type State = {
  searcLoading: boolean;
  markLoading: boolean;
  results: LocationSearchResult[];
  error: string | null;
  selected: LocationSelection | null;
  syncViewEnabled: boolean;
};

const initial: State = {
  searcLoading: false,
  markLoading: false,
  results: [],
  error: null,
  selected: null,
  syncViewEnabled: true,
};

type Actions = {
  setProperty: <K extends keyof State>(k: K, v: State[K]) => void;
  reset: () => void;
  resetSearch: () => void;
  resetSelection: () => void;
  setSyncViewEnabled: (value: boolean) => void;
};

const initialSearchState: Pick<
  State,
  "searcLoading" | "markLoading" | "results" | "error"
> = {
  markLoading: initial.markLoading,
  searcLoading: initial.searcLoading,
  results: initial.results,
  error: initial.error,
};

export const locationStore = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        ...initial,
        setProperty: (k, v) => set((state) => ({ ...state, [k]: v })),
        setSyncViewEnabled: (value) =>
          set((state) => ({ ...state, syncViewEnabled: value })),
        reset: () => set(initial),
        resetSearch: () =>
          set((state) => ({ ...state, ...initialSearchState })),
        resetSelection: () => set((state) => ({ ...state, selected: null })),
      }),
      {
        name: "locationStore",
        storage: createJSONStorage(() => customStorage),
      }
    )
  )
);
