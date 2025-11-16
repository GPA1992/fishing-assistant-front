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
import { fetchLocationsByBoundingBox } from "@/components/search";
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
  onClick: (position: LatLngTuple, bbox: BoundingBox) => void;
}) {
  const map = useMapEvents({
    click(e) {
      const bounds = map.getBounds();
      const bbox: BoundingBox = [
        bounds.getSouth(),
        bounds.getWest(),
        bounds.getNorth(),
        bounds.getEast(),
      ];

      onClick([e.latlng.lat, e.latlng.lng], bbox);
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
  const { selected, setSelectedLocation } = useLocationSelection();
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

  const mapContainerClassName = `h-[35vh] min-h-[220px] sm:h-[40vh] sm:min-h-[260px] md:h-[45vh] md:min-h-[300px] w-full ${
    className ?? ""
  }`;

  async function handleMapSelection(
    position: LatLngTuple,
    boundsBBox: BoundingBox
  ) {
    setManualMarker({ key: selectionKey, position });

    try {
      const [result] = await fetchLocationsByBoundingBox(
        `${position[0]},${position[1]}`,
        boundsBBox
      );

      if (result) {
        setSelectedLocation(result);
        setManualMarker({
          key: `sel-${result.id}`,
          position: result.center,
        });
      }
    } catch (error) {
      console.error("Erro ao buscar localização pelo mapa", error);
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
