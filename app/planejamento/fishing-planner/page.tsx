"use client";

import Search from "@/components/search";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../../../components/map"), {
  ssr: false,
});

export default function Page() {
  return (
    <>
      <Search />
      <Map />
    </>
  );
}
