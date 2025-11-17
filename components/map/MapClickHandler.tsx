import { type LatLngTuple } from "leaflet";
import { useMapEvents } from "react-leaflet";

import { type BoundingBox } from "@/core/request";

interface MapClickHandlerProps {
  onClick: (position: LatLngTuple, bbox: BoundingBox) => void;
}

export default function MapClickHandler({ onClick }: MapClickHandlerProps) {
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
