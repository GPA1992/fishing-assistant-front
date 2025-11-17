import { type LatLngBoundsExpression, type LatLngTuple } from "leaflet";

import { type BoundingBox } from "@/core/request";

export function boundingBoxToBounds(bbox: BoundingBox): LatLngBoundsExpression {
  const [south, west, north, east] = bbox;
  return [
    [south, west],
    [north, east],
  ];
}

export function boundingBoxCenter(bbox: BoundingBox): LatLngTuple {
  const [south, west, north, east] = bbox;
  return [(south + north) / 2, (west + east) / 2];
}
