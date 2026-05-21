/**
 * trip-mapper.ts
 * Chuyển đổi dữ liệu từ BE format (Trip entity) → FE internal format
 * BE field names khác FE field names, file này đóng vai trò "adapter"
 */

import type { Trip, WeatherCache } from "@/src/types";

// FE internal format (dùng trong các component)
export interface FeTripActivity {
  id: string;
  time: string;        // "09:00" (cắt :ss từ "09:00:00")
  title: string;
  description: string;
  cost: number;
  lat: number;
  lng: number;
}

export interface FeTripDay {
  id: string;
  title: string;       // "Ngày 1", "Ngày 2", ...
  date?: string;       // "2026-05-20"
  activities: FeTripActivity[];
}

export interface FeWeatherDay {
  day: string;         // "N1", "N2", ...
  date: string;        // "2026-05-20"
  temp: number;
  tempMin?: number;
  condition: "sunny" | "rainy" | "cloudy";
  precipitationMm?: number;
}

export interface FeTripData {
  id: string;
  title: string;
  durationDays: number;
  totalBudget: number;
  currentBudget: number; // tính từ sum(estimatedCost) của tất cả activities
  destinations: string[];
  startDate?: string;
  endDate?: string;
  destLat?: number;
  destLng?: number;
  days: FeTripDay[];
  weather: FeWeatherDay[];
  isGuest: boolean;
  sessionId?: string;
}

/**
 * Map WMO weather code → condition string
 * https://open-meteo.com/en/docs#weathervariables
 */
function wmoCodeToCondition(code?: number | null): "sunny" | "rainy" | "cloudy" {
  if (code == null) return "sunny";
  if (code >= 51) return "rainy";   // Drizzle, Rain, Snow, Thunderstorm
  if (code >= 1) return "cloudy";   // Partly cloudy, Overcast, Fog
  return "sunny";                   // 0 = Clear sky
}

/**
 * Tính tổng chi tiêu ước tính từ các activities
 */
function calculateCurrentBudget(beTrip: Trip): number {
  return (beTrip.tripDays ?? [])
    .flatMap((d) => d.activities ?? [])
    .reduce((sum, act) => sum + (Number(act.estimatedCost) || 0), 0);
}

/**
 * Map WeatherCache[] → FeWeatherDay[]
 */
function mapWeatherCaches(caches: WeatherCache[], numDays: number): FeWeatherDay[] {
  if (!caches || caches.length === 0) return [];

  return caches.slice(0, numDays).map((w, idx) => ({
    day: `N${idx + 1}`,
    date: w.forecastDate,
    temp: Number(w.temperatureMax) || 0,
    tempMin: Number(w.temperatureMin) || undefined,
    condition: wmoCodeToCondition(w.weatherCode),
    precipitationMm: w.precipitationMm != null ? Number(w.precipitationMm) : undefined,
  }));
}

/**
 * Hàm mapper chính: BE Trip → FE FeTripData
 */
export function mapBeTripToFe(beTrip: Trip, sessionId?: string | null): FeTripData {
  const days: FeTripDay[] = (beTrip.tripDays ?? []).map((day) => ({
    id: String(day.id),
    title: `Ngày ${day.dayNumber}`,
    date: day.tripDate,
    activities: (day.activities ?? []).map((act) => ({
      id: String(act.id),
      // BE trả "09:00:00", FE muốn "09:00"
      time: act.startTime ? act.startTime.substring(0, 5) : "00:00",
      title: act.title,
      description: act.description ?? "",
      cost: Number(act.estimatedCost) || 0,
      lat: Number(act.locationLat) || 0,
      lng: Number(act.locationLng) || 0,
    })),
  }));

  const weather = mapWeatherCaches(beTrip.weatherCaches ?? [], beTrip.numDays);

  return {
    id: String(beTrip.id),
    title: beTrip.title,
    durationDays: beTrip.numDays,
    totalBudget: Number(beTrip.budgetTotal) || 0,
    currentBudget: calculateCurrentBudget(beTrip),
    destinations: [beTrip.destinationName],
    startDate: beTrip.startDate,
    endDate: beTrip.endDate,
    destLat: beTrip.destLat != null ? Number(beTrip.destLat) : undefined,
    destLng: beTrip.destLng != null ? Number(beTrip.destLng) : undefined,
    days,
    weather,
    isGuest: !beTrip.user,
    sessionId: sessionId ?? beTrip.sessionId,
  };
}
