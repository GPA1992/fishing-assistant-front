"use client";

import { locationStore } from "@/core/request";
import { LoadingInline } from "../loading";
import { MapPinCheckInside } from "lucide-react";

export default function PlanningData() {
  const selected = locationStore((state) => state.selected);
  const markLoading = locationStore((state) => state.markLoading);
  const searcLoading = locationStore((state) => state.searcLoading);
  const today = new Intl.DateTimeFormat("pt-BR").format(new Date());
  const loading = markLoading || searcLoading;

  return (
    <section className="relative z-20 w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl shadow-emerald-900/10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 12% 18%, var(--color-gradient-1) 0, transparent 22%), radial-gradient(circle at 88% 14%, var(--color-gradient-2) 0, transparent 22%), radial-gradient(circle at 50% 80%, var(--color-gradient-3) 0, transparent 24%)",
        }}
      />

      <div className="relative flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3 min-w-0">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-surface-muted)] text-[var(--color-primary-strong)] shadow-inner shadow-emerald-900/10">
            <MapPinCheckInside className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div className="space-y-1 min-w-0 min-h-16">
            {loading ? (
              <LoadingInline
                label="Carregando"
                className="self-start sm:self-center"
              />
            ) : (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--color-primary)_60%,var(--color-primary-strong)_40%)]">
                  Destino selecionado
                </p>
                <h2 className="truncate text-sm font-semibold text-[var(--color-primary-strong)] sm:text-base sm:max-w-[490px] max-w-[260px]">
                  {selected ? selected.name : "Escolha um ponto no mapa"}
                </h2>
                {selected ? (
                  <p className="text-xs font-medium text-[var(--color-muted)] sm:text-[13px]">
                    Coordenadas preparadas para o próximo passo.
                  </p>
                ) : (
                  <p className="text-xs font-medium text-[var(--color-muted)] sm:text-[13px]">
                    Toque no mapa para definir o local.
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/*       {loading ? (
          <LoadingInline
            label="Carregando"
            className="self-start sm:self-center"
          />
        ) : null} */}
      </div>

      <div className="relative flex flex-wrap items-center gap-2 border-t border-[color-mix(in_srgb,var(--color-border)_70%,transparent)] px-4 py-3 sm:px-5">
        <span className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-surface-muted)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary-strong)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary-strong)]" />
          Data · {today}
        </span>
        {selected ? (
          <span className="text-xs font-medium text-[var(--color-primary)]">
            Mantenha a seleção para atualizar o mapa.
          </span>
        ) : (
          <span className="text-xs font-medium text-[var(--color-muted)]">
            Nenhum local definido ainda.
          </span>
        )}
      </div>
    </section>
  );
}
