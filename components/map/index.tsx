"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { type LatLngTuple } from "leaflet";

import MapClickHandler from "./MapClickHandler";
import SyncView from "./SyncView";
import { boundingBoxCenter } from "./bounding-box";
import { ensureDefaultMarkerConfig } from "./configure-default-marker";
import {
  type BoundingBox,
  locationStore,
  searchLocationsByBoundingBoxAction,
} from "@/core/request";

const DEFAULT_CENTER: LatLngTuple = [-24.02323, -48.9034806];
const DEFAULT_ZOOM = 10;

ensureDefaultMarkerConfig();

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
  const selected = locationStore((state) => state.selected);
  const syncViewEnabled = locationStore((state) => state.syncViewEnabled);
  const setSyncViewEnabled = locationStore((state) => state.setSyncViewEnabled);
  const activeBBox = selected?.boundingBox ?? bbox;

  const derivedCenter = useMemo(() => {
    if (activeBBox) return boundingBoxCenter(activeBBox);
    return initialCenter;
  }, [activeBBox, initialCenter]);

  const [manualPosition, setManualPosition] = useState<LatLngTuple | null>(
    null
  );

  const markerPosition = syncViewEnabled
    ? selected?.center ?? derivedCenter
    : manualPosition ?? selected?.center ?? derivedCenter;

  const mapContainerClassName = `h-[35vh] min-h-[220px] sm:h-[40vh] sm:min-h-[260px] md:h-[45vh] md:min-h-[300px] w-full ${
    className ?? ""
  }`;

  async function handleMapSelection(
    position: LatLngTuple,
    boundsBBox: BoundingBox
  ) {
    setManualPosition(position);
    setSyncViewEnabled(false);

    try {
      await searchLocationsByBoundingBoxAction({
        term: `${position[0]},${position[1]}`,
        bbox: boundsBBox,
      });
    } catch (error) {
      console.error("Erro ao buscar localização pelo mapa", error);
    }
    const latestSelection = locationStore.getState().selected;
    if (latestSelection) {
      setManualPosition(position);
    }
  }

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
            onClick={(position: LatLngTuple, mapBounds) => {
              handleMapSelection(position, mapBounds);
            }}
          />
          {syncViewEnabled && <SyncView center={markerPosition} />}
        </MapContainer>
      </div>
    </div>
  );
}
