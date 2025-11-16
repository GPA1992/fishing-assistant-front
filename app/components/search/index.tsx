"use client";

import {
  BoundingBox,
  LocationSelection,
  useLocationSelection,
} from "@/context/location-selection";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export type SearchResult = LocationSelection;

type RawNominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  boundingbox: [string, string, string, string];
  address?: {
    city?: string;
    town?: string;
    village?: string;
    hamlet?: string;
    municipality?: string;
    suburb?: string;
    neighbourhood?: string;
    quarter?: string;
    city_district?: string;
    state?: string;
    postcode?: string;
    road?: string;
  };
};

function parseResult(raw: RawNominatimResult): SearchResult {
  const south = parseFloat(raw.boundingbox[0]);
  const north = parseFloat(raw.boundingbox[1]);
  const west = parseFloat(raw.boundingbox[2]);
  const east = parseFloat(raw.boundingbox[3]);

  const city =
    raw.address?.city ||
    raw.address?.town ||
    raw.address?.village ||
    raw.address?.hamlet ||
    raw.address?.municipality;
  const neighborhood =
    raw.address?.suburb ||
    raw.address?.neighbourhood ||
    raw.address?.quarter ||
    raw.address?.city_district;
  const state = raw.address?.state;
  const postcode = raw.address?.postcode;
  const detail = raw.address?.road;

  const formattedName =
    [neighborhood, city, state, postcode, detail].filter(Boolean).join(", ") ||
    raw.display_name;

  return {
    id: raw.place_id,
    name: formattedName,
    center: [parseFloat(raw.lat), parseFloat(raw.lon)],
    boundingBox: [south, west, north, east] as BoundingBox,
  };
}

async function fetchLocations(term: string, signal?: AbortSignal) {
  console.log(term);

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${term}+brasil&format=json&addressdetails=1`,
    {
      headers: {
        "Accept-Language": "pt-BR",
      },
      signal,
    }
  );

  if (!response.ok) throw new Error("Falha ao buscar localização");

  const data: RawNominatimResult[] = await response.json();
  return data.map(parseResult);
}

export default function Search() {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);

  const { selected, setSelectedLocation } = useLocationSelection();

  const debouncedTerm = useDebounce(term, 300);
  const trimmedTerm = debouncedTerm.trim();

  const { data: results = [], isFetching } = useQuery<SearchResult[]>({
    queryKey: ["search-location", trimmedTerm],
    queryFn: ({ signal }) => fetchLocations(trimmedTerm, signal),
    enabled: trimmedTerm.length > 0,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    setOpen(trimmedTerm.length > 0);
  }, [trimmedTerm]);

  return (
    <section className="theme-card relative z-20 rounded-3xl shadow-xl shadow-emerald-900/10 border-none">
      <div className="relative space-y-4 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-accent)] text-[var(--color-primary-strong)] shadow-inner shadow-emerald-900/10">
            <svg
              aria-hidden="true"
              className="h-5 w-5"
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
          <h2 className="text-base font-semibold text-[var(--color-primary-strong)]">
            Destino
          </h2>
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
              placeholder="Cidade, rio ou lago"
              className="theme-input w-full rounded-2xl border-none bg-[var(--color-surface)] px-4 py-3 pl-12 text-base text-[var(--color-primary-strong)] shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition placeholder:opacity-80"
            />
            {isFetching && (
              <div className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-[var(--color-primary)]">
                buscando...
              </div>
            )}

            {open && (
              <ul className="absolute left-0 right-0 top-[110%] z-30 max-h-60 overflow-y-auto rounded-2xl border-none bg-[var(--color-surface)] shadow-xl shadow-emerald-900/10">
                {results.length === 0 && !isFetching && (
                  <li className="px-4 py-3 text-sm text-[var(--color-muted)]">
                    Nada encontrado
                  </li>
                )}
                {results.map((item) => (
                  <li key={item.id} className="last:border-none">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLocation(item);
                        setTerm("");
                        setOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[var(--color-highlight)] active:bg-[var(--color-accent)]"
                    >
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)] text-[var(--color-primary-strong)]">
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

        {selected && (
          <div className="flex items-center gap-2 rounded-2xl bg-[var(--color-highlight)] px-4 py-3 text-sm text-[var(--color-text)]">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)] text-[var(--color-primary-strong)]">
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

function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
