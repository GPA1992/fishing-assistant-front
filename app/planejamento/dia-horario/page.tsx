"use client";

import { MyDatePicker } from "@/components/day-picker";

export default function Page() {
  return (
    <section className="relative z-20 rounded-2xl shadow-xl shadow-emerald-900/10 border-none p-2">
      <MyDatePicker />
    </section>
  );
}
