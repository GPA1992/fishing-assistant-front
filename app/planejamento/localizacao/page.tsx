"use client";

import Search from "@/components/search";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../../../components/map"), {
  ssr: false,
});

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <Search />
      <Map />
    </div>
  );
}
