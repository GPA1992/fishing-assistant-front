import { useEffect } from "react";
import { type LatLngTuple } from "leaflet";
import { useMap } from "react-leaflet";

interface SyncViewProps {
  center: LatLngTuple;
  zoom?: number;
}

export default function SyncView({ center, zoom = 14 }: SyncViewProps) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, map, zoom]);

  return null;
}
