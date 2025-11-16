"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type BoundingBox = [
  south: number,
  west: number,
  north: number,
  east: number
];

export type LocationSelection = {
  id: number;
  name: string;
  center: [number, number];
  boundingBox: BoundingBox;
};

const LocationSelectionContext = createContext<{
  selected: LocationSelection | null;
  setSelectedLocation: (location: LocationSelection | null) => void;
} | null>(null);

export function LocationSelectionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selected, setSelectedLocation] = useState<LocationSelection | null>(
    null
  );

  const value = useMemo(() => ({ selected, setSelectedLocation }), [selected]);

  return (
    <LocationSelectionContext.Provider value={value}>
      {children}
    </LocationSelectionContext.Provider>
  );
}

export function useLocationSelection() {
  const ctx = useContext(LocationSelectionContext);
  if (!ctx)
    throw new Error(
      "useLocationSelection must be used within LocationSelectionProvider"
    );
  return ctx;
}
