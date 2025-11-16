"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import Search from "./components/search";

const InteractiveMap = dynamic(() => import("./components/map"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50 text-slate-900">
      <Search />
      {/*   <InteractiveMap /> */}
    </main>
  );
}
