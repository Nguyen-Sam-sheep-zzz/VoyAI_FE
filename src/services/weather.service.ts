import api from "@/lib/axios";
import type { DailyWeatherDTO } from "@/src/types";

/**
 * Lấy dự báo thời tiết từ BE (Open-Meteo qua proxy BE)
 * Endpoint: GET /api/public/weather/forecast?lat=&lng=
 * Không cần auth (permitAll)
 */
const getForecast = async (lat: number, lng: number): Promise<DailyWeatherDTO[]> => {
  const { data } = await api.get<DailyWeatherDTO[]>("/public/weather/forecast", {
    params: { lat, lng },
  });
  return data;
};

export const weatherService = {
  getForecast,
};
