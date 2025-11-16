"use client";

import L, { type LatLngBoundsExpression, type LatLngTuple } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import {
  BoundingBox,
  useLocationSelection,
} from "@/context/location-selection";

const DEFAULT_CENTER: LatLngTuple = [-24.02323, -48.9034806];
const DEFAULT_ZOOM = 10;

// Fix default marker assets when bundling with Next.js.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: typeof marker2x === "string" ? marker2x : marker2x.src,
  iconUrl: typeof markerIcon === "string" ? markerIcon : markerIcon.src,
  shadowUrl: typeof markerShadow === "string" ? markerShadow : markerShadow.src,
});

function boundingBoxToBounds(bbox: BoundingBox): LatLngBoundsExpression {
  const [south, west, north, east] = bbox;
  return [
    [south, west],
    [north, east],
  ];
}

function boundingBoxCenter(bbox: BoundingBox): LatLngTuple {
  const [south, west, north, east] = bbox;
  return [(south + north) / 2, (west + east) / 2];
}

function SyncView({
  bbox,
  center,
  userHasMoved,
}: {
  bbox?: BoundingBox;
  center: LatLngTuple;
  userHasMoved: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (bbox && !userHasMoved) {
      map.fitBounds(boundingBoxToBounds(bbox), {
        padding: [24, 24],
        animate: true,
      });
      map.setZoom(14);
      return;
    }

    map.setView(center);
  }, [bbox, center, map, userHasMoved]);

  return null;
}

function MapClickHandler({
  onClick,
}: {
  onClick: (position: LatLngTuple) => void;
}) {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });

  return null;
}

interface MapProps {
  bbox?: BoundingBox;
  initialCenter?: LatLngTuple;
  zoom?: number;
  className?: string;
}

export default function Map({
  bbox,
  initialCenter = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  className,
}: MapProps) {
  const { selected } = useLocationSelection();
  const activeBBox = selected?.boundingBox ?? bbox;
  const selectionKey = useMemo(() => {
    if (selected) return `sel-${selected.id}`;
    if (bbox) return `bbox-${bbox.join(",")}`;
    return "none";
  }, [bbox, selected]);

  const derivedCenter = useMemo(() => {
    if (activeBBox) return boundingBoxCenter(activeBBox);
    return initialCenter;
  }, [activeBBox, initialCenter]);

  const [manualMarker, setManualMarker] = useState<{
    key: string;
    position: LatLngTuple;
  } | null>(null);

  const markerPosition =
    manualMarker?.key === selectionKey ? manualMarker.position : derivedCenter;
  const userHasMoved = manualMarker?.key === selectionKey;

  const mapContainerClassName = `h-[50vh] min-h-[300px] sm:h-[58vh] sm:min-h-[340px] md:h-[62vh] md:min-h-[380px] w-full ${
    className ?? ""
  }`;

  return (
    <div className="theme-card relative z-0 overflow-hidden rounded-3xl shadow-2xl shadow-emerald-900/10 border-none">
      <div className="pointer-events-none absolute left-4 right-4 top-4 z-30 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-primary-strong)]">
        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-3 py-1 text-[var(--color-primary-strong)] shadow-sm shadow-emerald-900/10">
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3v18" />
            <path d="m7 14 5 5 5-5" />
          </svg>
          Toque
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-surface)] px-3 py-1 text-[var(--color-text)] shadow-sm shadow-emerald-900/10">
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15.5 14 5-5-5-5" />
            <path d="M8.5 19 3.5 14l5-5" />
          </svg>
          Mova/Zoom
        </span>
      </div>

      <MapContainer
        center={markerPosition}
        zoom={zoom}
        scrollWheelZoom
        className={mapContainerClassName}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={markerPosition} />
        <MapClickHandler
          onClick={(position: LatLngTuple) => {
            setManualMarker({ key: selectionKey, position });
          }}
        />
        <SyncView
          bbox={activeBBox}
          center={markerPosition}
          userHasMoved={userHasMoved}
        />
      </MapContainer>

      <div className="pointer-events-none absolute inset-x-4 bottom-4 z-30 flex flex-wrap gap-2 text-xs font-medium text-[var(--color-primary-strong)]">
        <span className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-surface)] px-4 py-2 shadow-md shadow-emerald-900/10">
          <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
          Pronto para marcar
        </span>
      </div>
    </div>
  );
}
