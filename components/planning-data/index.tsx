"use client";

import { planningStore } from "@/core/request";
import { LoadingInline } from "../loading";
import { Fish, MapPinCheckInside } from "lucide-react";

export default function PlanningData() {
  const selected = planningStore((state) => state.selected);
  const markLoading = planningStore((state) => state.markLoading);
  const searcLoading = planningStore((state) => state.searcLoading);
  const targetDate = planningStore((state) => state.targetDate);
  const targetHour = planningStore((state) => state.targetHour);

  const dateLabel = targetDate
    ? new Date(targetDate).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;
  const loading = markLoading || searcLoading;

  return (
    <section className="relative z-20 w-full overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--color-border)_75%,var(--color-primary)_25%)] bg-[var(--color-surface)] shadow-[0_18px_38px_rgba(0,0,0,0.06)]">
      <div className="relative flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3 min-w-0">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--color-highlight)_70%,var(--color-surface)_30%)] text-[var(--color-primary-strong)] ring-1 ring-[color-mix(in_srgb,var(--color-primary)_20%,var(--color-border)_80%)] shadow-[0_8px_20px_rgba(0,0,0,0.05)]">
            <Fish className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div className="space-y-1 min-w-0 min-h-16">
            {loading ? (
              <LoadingInline
                label="Carregando"
                className="self-start sm:self-center"
              />
            ) : (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-primary-strong)] opacity-80">
                  Planejamento
                </p>
                <h2 className="truncate text-sm font-semibold text-[var(--color-primary-strong)] sm:text-base sm:max-w-[490px] max-w-[260px]">
                  {selected?.address?.city &&
                    selected.locationName &&
                    `${selected.address.city}, ${selected.locationName}`}

                  {selected && !selected.locationName && `${selected?.name}`}
                </h2>
                {!selected && (
                  <p className="text-xs font-medium text-[var(--color-muted)] sm:text-[13px]">
                    Toque no mapa para definir o local.
                  </p>
                )}
                <div className="relative flex flex-wrap items-center gap-2">
                  {targetDate && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--color-surface-muted)_90%,white_10%)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary-strong)] ring-1 ring-[color-mix(in_srgb,var(--color-border)_70%,var(--color-primary)_15%)] shadow-[0_10px_20px_rgba(0,0,0,0.05)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary-strong)]" />
                      Data · {dateLabel}{" "}
                      {targetHour && `as · ${targetHour} horas.`}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
