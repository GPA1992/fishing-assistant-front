"use client";

import dynamic from "next/dynamic";
import Search from "./components/search";
import { LocationSelectionProvider } from "@/context/location-selection";

const InteractiveMap = dynamic(() => import("./components/map"), {
  ssr: false,
});

export default function Home() {
  return (
    <LocationSelectionProvider>
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50 text-slate-900 p-4 space-y-4">
        <Search />
        <InteractiveMap />
      </main>
    </LocationSelectionProvider>
  );
}
