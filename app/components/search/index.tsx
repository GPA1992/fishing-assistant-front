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
};

const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org/search?format=json&addressdetails=1";

function parseResult(raw: RawNominatimResult): SearchResult {
  const south = parseFloat(raw.boundingbox[0]);
  const north = parseFloat(raw.boundingbox[1]);
  const west = parseFloat(raw.boundingbox[2]);
  const east = parseFloat(raw.boundingbox[3]);

  return {
    id: raw.place_id,
    name: raw.display_name,
    center: [parseFloat(raw.lat), parseFloat(raw.lon)],
    boundingBox: [south, west, north, east] as BoundingBox,
  };
}

async function fetchLocations(term: string, signal?: AbortSignal) {
  const response = await fetch(
    `${NOMINATIM_URL}&q=${encodeURIComponent(term)}`,
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
    <div className="relative w-full max-w-xl">
      <label className="mb-1 block text-sm font-medium text-slate-700">
        Buscar localização
      </label>
      <input
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Ex: Guarizinho Brasil"
        className="w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
      />
      {isFetching && (
        <div className="absolute right-3 top-9 text-xs text-slate-500">
          buscando...
        </div>
      )}

      {open && (
        <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg">
          {results.length === 0 && !isFetching && (
            <li className="px-3 py-2 text-sm text-slate-500">Nenhum local encontrado</li>
          )}
          {results.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  setSelectedLocation(item);
                  setTerm(item.name);
                  setOpen(false);
                }}
                className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-slate-50"
              >
                <span className="text-sm font-medium text-slate-800">
                  {item.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <div className="mt-3 rounded-md border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Selecionado: {selected.name}
        </div>
      )}
    </div>
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
