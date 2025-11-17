"use client";

import { MyDatePicker } from "@/components/day-picker";
import { HourPicker } from "@/components/hour-picker";

export default function Page() {
  return (
    <section className="relative z-20 rounded-2xl shadow-xl shadow-emerald-900/10 border-none p-4">
      <div className="flex flex-row items-start gap-6">
        <MyDatePicker />
        <HourPicker orientation="horizontal" />
      </div>
    </section>
  );
}
