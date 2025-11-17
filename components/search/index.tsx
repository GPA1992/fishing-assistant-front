"use client";

import {
  planningStore,
  resetLocationSearchAction,
  searchLocationsAction,
  setSelectedLocationAction,
} from "@/core/request";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

export default function Search() {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);

  const debouncedTerm = useDebounce(term, 300);
  const trimmedTerm = debouncedTerm.trim();
  const results = planningStore((state) => state.results);
  const loading = planningStore((state) => state.searcLoading);

  useEffect(() => {
    setOpen(trimmedTerm.length > 0);
  }, [trimmedTerm]);

  useEffect(() => {
    if (!trimmedTerm) {
      resetLocationSearchAction();
      return;
    }

    const controller = new AbortController();
    searchLocationsAction(trimmedTerm, controller.signal);

    return () => controller.abort();
  }, [trimmedTerm]);

  return (
    <>
      <div className="relative space-y-4 p-0 sm:p-0 mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 min-w-9 items-center justify-center rounded-sm bg-[var(--color-accent)] text-[var(--color-primary-strong)] shadow-inner shadow-emerald-900/10 sm:h-10 sm:w-10">
            <MapPin className="h-5 w-5" />
          </span>

          <div>
            <h2 className="truncate text-sm font-semibold text-[var(--color-primary-strong)] sm:text-base sm:max-w-[490px] max-w-[260px]">
              Destino
            </h2>
            <p className="text-[10px] font-medium text-[var(--color-muted)] sm:text-[13px]">
              Busque por cidade, bairro, região ou marque a localização exata no
              mapa.
            </p>
          </div>
        </div>

        <div className="relative w-full">
          <label htmlFor="search-location" className="sr-only">
            Buscar
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--color-primary)] opacity-80">
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m16.5 16.5 4 4" />
              </svg>
            </span>
            <input
              id="search-location"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              onFocus={() => setOpen(trimmedTerm.length > 0)}
              placeholder="Cidade, bairro ou região"
              className="theme-input w-full rounded-xl border-none bg-[var(--color-surface)] px-3.5 py-2.5 pl-11 text-sm text-[var(--color-primary-strong)] shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition placeholder:opacity-80 sm:px-4 sm:py-3 sm:pl-12 sm:text-base"
            />
            {loading && (
              <div className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-[var(--color-primary)]">
                buscando...
              </div>
            )}

            {open && (
              <ul className="absolute left-0 right-0 top-[110%] z-30 max-h-60 overflow-y-auto rounded-xl border-none bg-[var(--color-surface)] shadow-xl shadow-emerald-900/10">
                {results.length === 0 && !loading && (
                  <li className="px-4 py-3 text-sm text-[var(--color-muted)]">
                    Nada encontrado
                  </li>
                )}
                {results.map((item) => (
                  <li key={item.id} className="last:border-none">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLocationAction(item);
                        setTerm("");
                        resetLocationSearchAction();
                        setOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[var(--color-highlight)] active:bg-[var(--color-accent)]"
                    >
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
                            d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z"
                          />
                          <circle cx="12" cy="11" r="2" />
                        </svg>
                      </span>
                      <span className="flex-1 text-sm font-medium text-[var(--color-text)]">
                        {item.name}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
