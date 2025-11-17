import type { ControlOptions } from "leaflet";

declare module "leaflet.fullscreen";
declare module "leaflet.fullscreen/Control.FullScreen.css";

declare module "leaflet" {
  interface MapOptions {
    fullscreenControl?: boolean;
    fullscreenControlOptions?: ControlOptions;
  }
}
