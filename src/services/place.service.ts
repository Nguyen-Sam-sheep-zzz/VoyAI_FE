import api from "@/lib/axios";
import type { PlaceSearchResult } from "@/src/types";

const searchPlace = async (query: string): Promise<PlaceSearchResult[]> => {
  const { data } = await api.get<PlaceSearchResult[]>("/public/places/search", {
    params: {
      q: query,
    },
  });
  return data;
};

const reversePlace = async (lat: number, lon: number): Promise<PlaceSearchResult> => {
  const { data } = await api.get<PlaceSearchResult>("/public/places/reverse", {
    params: {
      lat,
      lon,
    },
  });
  return data;
};

export const placeService = {
  searchPlace,
  reversePlace,
};
