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
    <div>
      <span className="text-sm italic text-[var(--color-muted)] mb-3 pl-1 px-1">
        Arraste, de zomm, clique para marcar o local.
      </span>
      <div className="relative z-0 overflow-hidden rounded-2xl shadow-2xl shadow-emerald-900/10 border-none">
        <MapContainer
          center={markerPosition}
          zoom={zoom}
          scrollWheelZoom
          zoomControl={false}
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
      </div>
    </div>
  );
}
