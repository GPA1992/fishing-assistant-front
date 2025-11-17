import axios from "axios";
import { planningStore } from "../store/planning.store";
import {
  searchLocationsByBoundingBoxService,
  searchLocationsService,
} from "../services/location.service";
import {
  type LocationSearchByBoundingBoxPayload,
  type LocationSelection,
} from "../types";

export async function searchLocationsAction(
  term: string,
  signal?: AbortSignal
) {
  const trimmedTerm = term.trim();
  const { setProperty, resetSearch } = planningStore.getState();

  if (!trimmedTerm) {
    resetSearch();
    return;
  }

  setProperty("searcLoading", true);
  setProperty("error", null);

  try {
    const results = await searchLocationsService(trimmedTerm, signal);
    setProperty("results", results);
  } catch (error) {
    if (!axios.isCancel(error)) {
      setProperty("error", "Falha ao buscar localização");
    }
    setProperty("results", []);
  } finally {
    setProperty("searcLoading", false);
  }
}

export function resetLocationSearchAction() {
  planningStore.getState().resetSearch();
}

export async function searchLocationsByBoundingBoxAction({
  term,
  bbox,
  signal,
}: LocationSearchByBoundingBoxPayload) {
  const { setProperty } = planningStore.getState();

  setProperty("markLoading", true);
  setProperty("error", null);

  try {
    const results = await searchLocationsByBoundingBoxService(
      term,
      bbox,
      signal
    );
    setProperty("results", results);
    setProperty("selected", results[0] ?? null);
  } catch (error) {
    if (!axios.isCancel(error)) {
      setProperty("error", "Erro ao buscar localização pelo mapa");
      console.error("Erro ao buscar localização pelo mapa", error);
    }
    setProperty("results", []);
    setProperty("selected", null);
  } finally {
    setProperty("markLoading", false);
  }
}

export function setSelectedLocationAction(
  location: LocationSelection | null
): void {
  const { setProperty, setSyncViewEnabled } = planningStore.getState();
  setProperty("selected", location);
  setSyncViewEnabled(true);
}

export function getSelectedLocation(): LocationSelection | null {
  return planningStore.getState().selected;
}

export function resetSelectedLocationAction() {
  planningStore.getState().resetSelection();
}
