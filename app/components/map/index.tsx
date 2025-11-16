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
}: {
  bbox?: BoundingBox;
  center: LatLngTuple;
}) {
  const map = useMap();

  useEffect(() => {
    if (bbox) {
      map.fitBounds(boundingBoxToBounds(bbox), {
        padding: [24, 24],
        animate: true,
      });
      map.setZoom(14);
      return;
    }

    map.setView(center);
  }, [bbox, center, map]);

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

  const derivedCenter = useMemo(() => {
    if (activeBBox) {
      return boundingBoxCenter(activeBBox);
    }
    return initialCenter;
  }, [activeBBox, initialCenter]);

  const [markerPosition, setMarkerPosition] =
    useState<LatLngTuple>(derivedCenter);

  useEffect(() => {
    setMarkerPosition(derivedCenter);
  }, [derivedCenter]);

  return (
    <MapContainer
      center={markerPosition}
      zoom={zoom}
      scrollWheelZoom
      className={className}
      style={{ minHeight: 320, width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={markerPosition} />
      <MapClickHandler
        onClick={(position: LatLngTuple) => setMarkerPosition(position)}
      />
      <SyncView bbox={activeBBox} center={markerPosition} />
    </MapContainer>
  );
}
