import { useState } from "react";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { HourPicker } from "../hour-picker";

export function MyDatePicker() {
  const [selected, setSelected] = useState<Date>();

  return (
    <div className="flex flex-col items-center w-full">
      <DayPicker
        animate
        navLayout="around"
        className="truncate text-sm font-semibold text-[var(--color-primary-strong)] min-h-[45vh] sm:text-base"
        mode="single"
        selected={selected}
        onSelect={setSelected}
      />
      <HourPicker />
    </div>
  );
}
