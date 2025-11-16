"use client";

import Search from "@/components/search";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../../../components/map"), {
  ssr: false,
});

export default function Page() {
  return (
    <section className="relative z-20 rounded-2xl shadow-xl shadow-emerald-900/10 border-none p-2">
      <Search />
      <Map />
    </section>
  );
}
