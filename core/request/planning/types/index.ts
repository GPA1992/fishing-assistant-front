export type BoundingBox = [
  south: number,
  west: number,
  north: number,
  east: number
];

export type LocationSelection = {
  id: number;
  name: string;
  center: [number, number];
  boundingBox: BoundingBox;
  address: {
    city?: string;
    town?: string;
    village?: string;
    hamlet?: string;
    municipality?: string;
    suburb?: string;
    neighbourhood?: string;
    quarter?: string;
    city_district?: string;
    state?: string;
    postcode?: string;
    road?: string;
  };
  locationName: string;
};

export type LocationSearchResult = LocationSelection;

export type RawNominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  boundingbox: [string, string, string, string];
  address: {
    city?: string;
    town?: string;
    village?: string;
    hamlet?: string;
    municipality?: string;
    suburb?: string;
    neighbourhood?: string;
    quarter?: string;
    city_district?: string;
    state?: string;
    postcode?: string;
    road?: string;
  };
  name: string;
};

export type LocationSearchByBoundingBoxPayload = {
  term: string;
  bbox: BoundingBox;
  signal?: AbortSignal;
};
