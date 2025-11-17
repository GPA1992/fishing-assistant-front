import { nominatimClient } from "../../http";
import {
  type BoundingBox,
  type LocationSearchResult,
  type RawNominatimResult,
} from "../types";

function parseResult(raw: RawNominatimResult): LocationSearchResult {
  console.log(raw);

  const south = parseFloat(raw.boundingbox[0]);
  const north = parseFloat(raw.boundingbox[1]);
  const west = parseFloat(raw.boundingbox[2]);
  const east = parseFloat(raw.boundingbox[3]);

  const city =
    raw.address?.city ||
    raw.address?.town ||
    raw.address?.village ||
    raw.address?.hamlet ||
    raw.address?.municipality;
  const neighborhood =
    raw.address?.suburb ||
    raw.address?.neighbourhood ||
    raw.address?.quarter ||
    raw.address?.city_district;
  const state = raw.address?.state;
  const postcode = raw.address?.postcode;
  const detail = raw.address?.road;

  const formattedName =
    [city, state, neighborhood, postcode, detail].filter(Boolean).join(", ") ||
    raw.display_name;

  return {
    id: raw.place_id,
    name: `${raw.name ? raw.name + "," : ""} ${formattedName}`,
    center: [parseFloat(raw.lat), parseFloat(raw.lon)],
    boundingBox: [south, west, north, east] as BoundingBox,
  };
}

export async function searchLocationsService(
  term: string,
  signal?: AbortSignal
): Promise<LocationSearchResult[]> {
  const response = await nominatimClient.get<RawNominatimResult[]>("/search", {
    params: {
      q: `${term} brasil`,
      format: "json",
      addressdetails: 1,
    },
    signal,
  });

  return response.data.map(parseResult);
}

export async function searchLocationsByBoundingBoxService(
  term: string,
  bbox: BoundingBox,
  signal?: AbortSignal
): Promise<LocationSearchResult[]> {
  const [south, west, north, east] = bbox;
  const viewbox = `${west},${north},${east},${south}`;

  const response = await nominatimClient.get<RawNominatimResult[]>("/search", {
    params: {
      q: term,
      format: "json",
      addressdetails: 1,
      viewbox,
      bounded: 1,
    },
    signal,
  });

  return response.data.map(parseResult);
}
