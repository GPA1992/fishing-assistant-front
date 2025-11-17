"use client";

import { locationStore } from "@/core/request";

export default function PlanningData() {
  const selected = locationStore((state) => state.selected);

  return (
    <section className="relative min-h-28 z-20 rounded-2xl shadow-xl shadow-emerald-900/10 border-none">
      <div className="relative space-y-4 p-4 sm:p-5">
        {selected && (
          <div className="flex items-center gap-2 rounded-xl bg-[var(--color-highlight)] px-4 py-3 text-sm text-[var(--color-text)]">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)] text-[var(--color-primary-strong)]">
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m5 13 4 4L19 7"
                />
              </svg>
            </span>
            <span className="font-semibold">{selected.name}</span>
          </div>
        )}
      </div>
    </section>
  );
}
