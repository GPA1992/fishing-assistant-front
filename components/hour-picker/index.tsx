"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type WheelEvent,
} from "react";

type HourPickerOrientation = "vertical" | "horizontal";

type HourPickerProps = {
  orientation?: HourPickerOrientation;
};

const HOURS = Array.from({ length: 24 }, (_, index) => index);

function formatHour(hour: number) {
  return hour.toString().padStart(2, "0");
}

export function HourPicker({ orientation = "vertical" }: HourPickerProps) {
  const [selectedHour, setSelectedHour] = useState(0);
  const isHorizontal = orientation === "horizontal";
  const dragState = useRef({
    active: false,
    lastCoord: 0,
    accumulated: 0,
  });

  const visibleHours = useMemo(() => {
    return [-2, -1, 0, 1, 2].map((offset) => {
      const value = (selectedHour + offset + 24) % 24;
      return { value, offset };
    });
  }, [selectedHour]);

  const handleWheel = useCallback((event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const direction = event.deltaY > 0 ? 1 : -1;

    setSelectedHour((prev) => {
      const next = prev + direction;
      if (next < 0) return 23;
      if (next > 23) return 0;
      return next;
    });
  }, []);

  const handleDragStart = useCallback((event: PointerEvent<HTMLDivElement>) => {
    dragState.current.active = true;
    dragState.current.lastCoord = isHorizontal ? event.clientX : event.clientY;
    dragState.current.accumulated = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  }, [isHorizontal]);

  const handleDragMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!dragState.current.active) return;
      const currentCoord = isHorizontal ? event.clientX : event.clientY;
      const delta = currentCoord - dragState.current.lastCoord;
      dragState.current.lastCoord = currentCoord;
      dragState.current.accumulated += delta;

      const stepThreshold = 28;
      while (Math.abs(dragState.current.accumulated) >= stepThreshold) {
        const direction = dragState.current.accumulated > 0 ? 1 : -1;
        setSelectedHour((prev) => {
          const next = prev + direction;
          if (next < 0) return 23;
          if (next > 23) return 0;
          return next;
        });
        dragState.current.accumulated -= direction * stepThreshold;
      }

      event.preventDefault();
    },
    [isHorizontal]
  );

  const handleDragEnd = useCallback(() => {
    dragState.current.active = false;
    dragState.current.accumulated = 0;
  }, []);

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm ${
        isHorizontal ? "flex-row" : "flex-col"
      }`}
    >
      <div className="text-sm font-semibold text-neutral-600">Horário</div>
      <div
        className={`relative overflow-hidden rounded-lg bg-neutral-50 ${
          isHorizontal ? "h-24 w-64" : "h-40 w-28"
        } touch-none`}
        onWheel={handleWheel}
        tabIndex={0}
        role="spinbutton"
        aria-valuemin={HOURS[0]}
        aria-valuemax={HOURS[HOURS.length - 1]}
        aria-valuenow={selectedHour}
        aria-label="Selecionar horário"
        aria-orientation={orientation}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerLeave={handleDragEnd}
        onPointerCancel={handleDragEnd}
      >
        <ul
          className={`absolute inset-0 flex items-center justify-center gap-2 text-lg font-semibold text-neutral-400 ${
            isHorizontal ? "flex-row" : "flex-col"
          }`}
        >
          {visibleHours.map(({ value, offset }) => (
            <li
              key={`${value}-${offset}`}
              className={`tabular-nums transition-all duration-150 ease-out ${
                offset === 0
                  ? "text-emerald-700 text-3xl"
                  : "opacity-60 text-xl"
              }`}
            >
              {formatHour(value)}
            </li>
          ))}
        </ul>
        <div
          className={`pointer-events-none absolute rounded-md border border-emerald-100 shadow-inner ${
            isHorizontal
              ? "inset-y-0 left-1/2 w-12 -translate-x-1/2"
              : "inset-x-0 top-1/2 h-10 -translate-y-1/2"
          }`}
        ></div>
      </div>
      <span className="text-xs text-neutral-500">Role para trocar a hora</span>
    </div>
  );
}
