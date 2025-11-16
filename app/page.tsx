"use client";

import dynamic from "next/dynamic";
import Search from "./components/search";
import { LocationSelectionProvider } from "@/context/location-selection";
import { ThemePanel } from "./components/theme";

const InteractiveMap = dynamic(() => import("./components/map"), {
  ssr: false,
});

export default function Home() {
  return (
    <LocationSelectionProvider>
      <main className="min-h-screen text-slate-900">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 pb-10 pt-6 gap-y-20">
          <ThemePanel />
          <Search />
          <InteractiveMap />
        </div>
      </main>
    </LocationSelectionProvider>
  );
}
