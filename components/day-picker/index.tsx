"use client";
import { useState } from "react";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { HourPicker } from "../hour-picker";
import { Clock, MapPin } from "lucide-react";
import { planningStore } from "@/core/request";

export function MyDatePicker() {
  const [selected, setSelected] = useState<Date>();
  const setProperty = planningStore((state) => state.setProperty);

  console.log(selected);

  return (
    <div className=" items-center w-full flex flex-col justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-9 w-9 min-w-9 items-center justify-center rounded-sm bg-[var(--color-accent)] text-[var(--color-primary-strong)] shadow-inner shadow-emerald-900/10 sm:h-10 sm:w-10">
          <MapPin className="h-5 w-5" />
        </span>

        <div>
          <h2 className="truncate text-sm font-semibold text-[var(--color-primary-strong)] sm:text-base sm:max-w-[490px] max-w-[260px]">
            Destino
          </h2>
          <p className="text-[8px] font-medium text-[var(--color-muted)] sm:text-[13px]">
            Busque por cidade, bairro, região ou marque a localização exata no
            mapa.
          </p>
        </div>
      </div>
      <DayPicker
        animate
        navLayout="around"
        className="truncate text-sm font-semibold text-[var(--color-primary-strong)] min-h-80  sm:text-base"
        mode="single"
        selected={selected}
        onSelect={(v) => {
          if (v) {
            setProperty("targetDate", v);
            setSelected(v);
          }
        }}
      />
      <HourPicker />
    </div>
  );
}
