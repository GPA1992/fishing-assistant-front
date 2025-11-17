/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import "leaflet.fullscreen/Control.FullScreen.css";
import "leaflet.fullscreen";
import { useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { type LatLngTuple } from "leaflet";

import MapClickHandler from "./MapClickHandler";
import SyncView from "./SyncView";
import { boundingBoxCenter } from "./bounding-box";
import { ensureDefaultMarkerConfig } from "./configure-default-marker";
import {
  type BoundingBox,
  planningStore,
  searchLocationsByBoundingBoxAction,
} from "@/core/request";
import { cn } from "@/lib/utils";

const DEFAULT_CENTER: LatLngTuple = [-24.02323, -48.9034806];
const DEFAULT_ZOOM = 10;

ensureDefaultMarkerConfig();

const BASE_LAYERS = [
  {
    id: "osm",
    label: "OSM",
    baseLayerName: "openstreetmap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    previewUrl: "https://tile.openstreetmap.org/3/2/3.png",
  },
  {
    id: "esri",
    label: "Esri Satélite",
    baseLayerName: "esri_satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles © Esri — Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, METI, TomTom, 2012",
    previewUrl:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/3/2/2",
  },
] as const;

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
  const selected = planningStore((state) => state.selected);
  const syncViewEnabled = planningStore((state) => state.syncViewEnabled);
  const setSyncViewEnabled = planningStore((state) => state.setSyncViewEnabled);
  const markLoading = planningStore((state) => state.markLoading);
  const searcLoading = planningStore((state) => state.searcLoading);
  const activeBBox = selected?.boundingBox ?? bbox;

  const derivedCenter = useMemo(() => {
    if (activeBBox) return boundingBoxCenter(activeBBox);
    return initialCenter;
  }, [activeBBox, initialCenter]);

  const [baseLayer, setBaseLayer] = useState(BASE_LAYERS[0]);
  const [baseSelectorOpen, setBaseSelectorOpen] = useState(false);
  const [manualPosition, setManualPosition] = useState<LatLngTuple | null>(
    null
  );

  const markerPosition = syncViewEnabled
    ? selected?.center ?? derivedCenter
    : manualPosition ?? selected?.center ?? derivedCenter;

  const mapContainerClassName = `h-[38vh] min-h-[220px] sm:h-[40vh] sm:min-h-[260px] md:h-[45vh] md:min-h-[300px] w-full ${
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
    const latestSelection = planningStore.getState().selected;
    if (latestSelection) {
      setManualPosition(position);
    }
  }

  return (
    <>
      <div className="relative z-0 overflow-hidden rounded-2xl shadow-2xl shadow-emerald-900/10 border-none">
        <div className="absolute bottom-3 left-3 z-[1000]">
          <div className="relative rounded-md p-1 w-fit space-y-2">
            {baseSelectorOpen && (
              <div
                className={cn(
                  "absolute bottom-full mb-2 left-0 bg-white p-2 rounded-md shadow-lg z-10 flex flex-col gap-2"
                )}
              >
                {BASE_LAYERS.map((layer) => (
                  <div
                    key={layer.id}
                    onClick={() => {
                      setBaseLayer(layer as any);
                      setBaseSelectorOpen(false);
                    }}
                    className={cn(
                      "w-[40px] h-[40px] border-2 rounded-md overflow-hidden cursor-pointer hover:scale-105 transition",
                      baseLayer.id === layer.id && "border-emerald-700 border-2"
                    )}
                  >
                    <img
                      src={layer.previewUrl}
                      alt={layer.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="border w-max rounded-md border-emerald-700 bg-white shadow-sm">
              <div
                className="w-[60px] h-[60px] rounded-md overflow-hidden cursor-pointer border border-white"
                onClick={() => setBaseSelectorOpen((prev) => !prev)}
                aria-label="Alterar mapa base"
                role="button"
              >
                <img
                  src={baseLayer.previewUrl}
                  alt={`${baseLayer.label} Preview`}
                  className="w-full h-full object-cover border-emerald-700"
                />
              </div>
            </div>
          </div>
        </div>

        <MapContainer
          center={markerPosition}
          fullscreenControl={true}
          zoom={zoom}
          scrollWheelZoom
          zoomControl={false}
          attributionControl={false}
          className={mapContainerClassName}
        >
          <TileLayer
            key={baseLayer.id}
            attribution={baseLayer.attribution}
            url={baseLayer.url}
          />

          <Marker position={markerPosition} />
          {!markLoading && !searcLoading && (
            <MapClickHandler
              onClick={(position: LatLngTuple, mapBounds) => {
                handleMapSelection(position, mapBounds);
              }}
            />
          )}
          {syncViewEnabled && <SyncView center={markerPosition} />}
        </MapContainer>
      </div>
      <span className="text-sm italic text-[var(--color-muted)] mb-3 pl-1 px-1">
        Arraste, de zomm, clique para marcar o local.
      </span>
    </>
  );
}
