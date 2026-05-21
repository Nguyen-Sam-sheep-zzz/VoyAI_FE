import api from "@/lib/axios";
import type {
  Activity,
  ActivityUpdateRequest,
  ApiMessageResponse,
  ReorderRequest,
} from "@/src/types";

const updateActivity = async (
  id: number,
  payload: ActivityUpdateRequest
): Promise<Activity> => {
  const { data } = await api.put<Activity>(`/activities/${id}`, payload);
  return data;
};

const deleteActivity = async (id: number): Promise<ApiMessageResponse> => {
  const { data } = await api.delete<ApiMessageResponse>(`/activities/${id}`);
  return data;
};

const reorderActivities = async (
  payload: ReorderRequest
): Promise<ApiMessageResponse> => {
  const { data } = await api.put<ApiMessageResponse>("/activities/reorder", payload);
  return data;
};

/**
 * Reorder cho Guest — goi /api/guest/activities/reorder voi X-Session-Id header
 */
const reorderActivitiesAsGuest = async (
  payload: ReorderRequest,
  sessionId: string
): Promise<ApiMessageResponse> => {
  const { data } = await api.put<ApiMessageResponse>("/guest/activities/reorder", payload, {
    headers: { "X-Session-Id": sessionId },
  });
  return data;
};

const addActivity = async (
  tripDayId: number,
  payload: ActivityUpdateRequest
): Promise<Activity> => {
  const { data } = await api.post<Activity>(
    `/activities/trip-day/${tripDayId}`,
    payload
  );
  return data;
};

export const activityService = {
  updateActivity,
  deleteActivity,
  reorderActivities,
  reorderActivitiesAsGuest,
  addActivity,
};
