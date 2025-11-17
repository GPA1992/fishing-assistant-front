import L from "leaflet";

import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let defaultMarkerConfigured = false;

export function ensureDefaultMarkerConfig() {
  if (defaultMarkerConfigured) return;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: typeof marker2x === "string" ? marker2x : marker2x.src,
    iconUrl: typeof markerIcon === "string" ? markerIcon : markerIcon.src,
    shadowUrl:
      typeof markerShadow === "string" ? markerShadow : markerShadow.src,
  });

  defaultMarkerConfigured = true;
}
