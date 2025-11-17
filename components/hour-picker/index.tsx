"use client";

import { planningStore } from "@/core/request";
import { useMemo, useRef, useState } from "react";

const hours = Array.from({ length: 24 }, (_, i) => i);

export function HourPicker() {
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const formattedHours = useMemo(
    () => hours.map((hour) => hour.toString().padStart(2, "0")),
    []
  );
  const setProperty = planningStore((state) => state.setProperty);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const delta = direction === "left" ? -120 : 120;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="w-full flex flex-col items-center">
      <span
        className={
          "text-xs font-medium text-[var(--color-muted)] sm:text-[13px] mb-2"
        }
      >
        Selecione a hora que pretende pescar
      </span>
      <div className="relative w-full flex flex-row items-center justify-center text-sm font-medium tracking-tight text-slate-800">
        <span className="text-slate-500 mr-1">{"<"}</span>
        <div
          ref={scrollRef}
          onWheel={(e) => {
            const el = scrollRef.current;
            if (!el) return;
            if (Math.abs(e.deltaY) < 1) return;
            e.preventDefault();
            el.scrollBy({ left: e.deltaY, behavior: "auto" });
          }}
          onMouseDown={(e) => {
            const el = scrollRef.current;
            if (!el) return;
            dragRef.current = {
              active: true,
              startX: e.clientX,
              scrollLeft: el.scrollLeft,
            };
            setIsDragging(true);
          }}
          onMouseMove={(e) => {
            const el = scrollRef.current;
            if (!el || !dragRef.current.active) return;
            e.preventDefault();
            const deltaX = e.clientX - dragRef.current.startX;
            el.scrollLeft = dragRef.current.scrollLeft - deltaX;
          }}
          onMouseUp={() => {
            dragRef.current.active = false;
            setIsDragging(false);
          }}
          onMouseLeave={() => {
            dragRef.current.active = false;
            setIsDragging(false);
          }}
          className={`hour-scroll overflow-x-auto px-5 py-1 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="inline-flex min-w-max gap-3 whitespace-nowrap">
            {formattedHours.map((hour, index) => {
              const isSelected = selectedHour === index;
              return (
                <button
                  key={hour}
                  type="button"
                  onClick={() => {
                    setSelectedHour(index);
                    setProperty("targetHour", index.toString());
                  }}
                  className={`relative select-none text-left tabular-nums transition-colors p-[2px] ${
                    isSelected
                      ? "text-slate-900 bg-[var(--color-accent)]/60 rounded  "
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {hour}
                  {isSelected ? (
                    <span className="absolute left-0 right-0 -bottom-1 h-px bg-current" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
        <span className="text-slate-500 ml-1">{">"}</span>
      </div>
      <style jsx>{`
        .hour-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
