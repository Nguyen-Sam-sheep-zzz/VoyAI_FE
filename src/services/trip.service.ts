import api from "@/lib/axios";
import type {
  ApiMessageResponse,
  ToggleShareRequest,
  ToggleShareResponse,
  Trip,
  TripRequest,
} from "@/src/types";

const getMyTrips = async (): Promise<Trip[]> => {
  const { data } = await api.get<Trip[]>("/trips");
  return data;
};

const getTripById = async (id: number): Promise<Trip> => {
  const { data } = await api.get<Trip>(`/trips/${id}`);
  return data;
};

const createTrip = async (payload: TripRequest): Promise<Trip> => {
  const { data } = await api.post<Trip>("/trips", payload);
  return data;
};

const deleteTrip = async (id: number): Promise<ApiMessageResponse> => {
  const { data } = await api.delete<ApiMessageResponse>(`/trips/${id}`);
  return data;
};

const toggleShare = async (
  id: number,
  payload: ToggleShareRequest
): Promise<ToggleShareResponse> => {
  const { data } = await api.patch<ToggleShareResponse>(
    `/trips/${id}/share`,
    payload
  );
  return data;
};

const createGuestTrip = async (
  payload: TripRequest,
  sessionId?: string
): Promise<{ trip: Trip; sessionId: string | null }> => {
  const response = await api.post<Trip>("/guest/trips", payload, {
    headers: sessionId
      ? {
          "X-Session-Id": sessionId,
        }
      : undefined,
  });

  return {
    trip: response.data,
    sessionId: response.headers["x-session-id"] ?? null,
  };
};

const getGuestTrips = async (sessionId: string): Promise<Trip[]> => {
  const { data } = await api.get<Trip[]>("/guest/trips", {
    headers: {
      "X-Session-Id": sessionId,
    },
  });
  return data;
};

const getGuestTripById = async (id: number, sessionId: string): Promise<Trip> => {
  const { data } = await api.get<Trip>(`/guest/trips/${id}`, {
    headers: {
      "X-Session-Id": sessionId,
    },
  });
  return data;
};

export const tripService = {
  getMyTrips,
  getTripById,
  createTrip,
  deleteTrip,
  toggleShare,
  createGuestTrip,
  getGuestTrips,
  getGuestTripById,
};
