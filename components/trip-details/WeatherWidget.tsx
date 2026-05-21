"use client"

import { useEffect, useState } from "react"
import { CloudRain, Sun, Cloud, Thermometer, Wind, Droplets } from "lucide-react"
import { weatherService } from "@/src/services/weather.service"
import type { FeWeatherDay } from "@/lib/trip-mapper"

interface WeatherWidgetProps {
  weatherData?: FeWeatherDay[]
  destLat?: number
  destLng?: number
}

// Chuyen doi ngay trong tuan tu date string
function getDayOfWeek(dateStr: string, index: number): string {
  if (!dateStr) return `N${index + 1}`
  try {
    const d = new Date(dateStr)
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
    return days[d.getDay()]
  } catch {
    return `N${index + 1}`
  }
}

// Format nhiet do: 31.5 -> "32°C"
function formatTemp(temp: number): string {
  return `${Math.round(temp)}°C`
}

// Label mo ta thoi tiet
function getWeatherLabel(condition: string): string {
  switch (condition) {
    case "sunny": return "Nắng đẹp"
    case "rainy":  return "Có mưa"
    case "cloudy": return "Nhiều mây"
    default:       return "Bình thường"
  }
}

function getWeatherStyle(condition: string) {
  switch (condition) {
    case "sunny":
      return {
        icon: <Sun className="w-7 h-7 text-orange-500" />,
        bg: "bg-gradient-to-b from-orange-50 to-amber-50 border-orange-100",
        text: "text-orange-700",
        badge: "bg-orange-100 text-orange-600",
      }
    case "rainy":
      return {
        icon: <CloudRain className="w-7 h-7 text-blue-500" />,
        bg: "bg-gradient-to-b from-blue-50 to-indigo-50 border-blue-100",
        text: "text-blue-700",
        badge: "bg-blue-100 text-blue-600",
      }
    case "cloudy":
      return {
        icon: <Cloud className="w-7 h-7 text-gray-500" />,
        bg: "bg-gradient-to-b from-gray-50 to-slate-100 border-gray-200",
        text: "text-gray-700",
        badge: "bg-gray-100 text-gray-600",
      }
    default:
      return {
        icon: <Sun className="w-7 h-7 text-orange-500" />,
        bg: "bg-orange-50 border-orange-100",
        text: "text-orange-700",
        badge: "bg-orange-100 text-orange-600",
      }
  }
}

const FALLBACK_WEATHER: FeWeatherDay[] = [
  { day: "T2", date: "", temp: 32, condition: "sunny" },
  { day: "T3", date: "", temp: 29, condition: "rainy" },
  { day: "T4", date: "", temp: 31, condition: "cloudy" },
  { day: "T5", date: "", temp: 33, condition: "sunny" },
]

export default function WeatherWidget({ weatherData, destLat, destLng }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<FeWeatherDay[]>(weatherData ?? [])
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    if (weatherData && weatherData.length > 0) {
      setWeather(weatherData)
      return
    }
    if (destLat != null && destLng != null) {
      setIsFetching(true)
      weatherService
        .getForecast(destLat, destLng)
        .then(forecast => {
          if (forecast && forecast.length > 0) {
            const mapped: FeWeatherDay[] = forecast.slice(0, 7).map((w, idx) => {
              const code = w.weatherCode ?? 0
              const condition: "sunny" | "rainy" | "cloudy" =
                code >= 51 ? "rainy" : code >= 1 ? "cloudy" : "sunny"
              return {
                day: getDayOfWeek(w.date ?? "", idx),
                date: w.date ?? "",
                temp: Math.round(w.tempMax ?? 30),
                tempMin: w.tempMin != null ? Math.round(w.tempMin) : undefined,
                condition,
                precipitationMm: w.precipitation ?? undefined,
              }
            })
            setWeather(mapped)
          } else {
            setWeather(FALLBACK_WEATHER)
          }
        })
        .catch(() => setWeather(FALLBACK_WEATHER))
        .finally(() => setIsFetching(false))
    } else {
      setWeather(FALLBACK_WEATHER)
    }
  }, [weatherData, destLat, destLng])

  const displayWeather = weather.length > 0 ? weather : FALLBACK_WEATHER

  // Lay ngay trong tuan tu date hoac dung day label
  const withDayOfWeek = displayWeather.map((w, idx) => ({
    ...w,
    dayLabel: w.date ? getDayOfWeek(w.date, idx) : w.day,
  }))

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-orange-100/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-orange-400" />
          Thời tiết dự kiến
          {isFetching && (
            <span className="inline-block w-3 h-3 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          )}
        </h3>
        {/* Chu thich nhanh */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Sun className="w-3 h-3 text-orange-400" />
          <span>Nắng</span>
          <CloudRain className="w-3 h-3 text-blue-400" />
          <span>Mưa</span>
        </div>
      </div>

      {/* Grid thoi tiet — 4 cot */}
      <div className="grid grid-cols-4 gap-2">
        {withDayOfWeek.slice(0, 4).map((w, idx) => {
          const style = getWeatherStyle(w.condition)
          return (
            <div
              key={idx}
              className={`group relative flex flex-col items-center py-3 px-1 rounded-2xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-md cursor-default ${style.bg}`}
            >
              {/* Ngay thu */}
              <span className="text-xs font-bold text-gray-600 mb-1.5">{w.dayLabel}</span>

              {/* Icon thoi tiet */}
              {style.icon}

              {/* Nhiet do max (cao nhat) */}
              <div className="flex items-center gap-0.5 mt-1.5">
                <span className="text-[10px] font-bold text-orange-400">↑</span>
                <span className={`text-sm font-bold ${style.text}`}>
                  {formatTemp(w.temp)}
                </span>
              </div>

              {/* Nhiet do min (thap nhat) */}
              {w.tempMin != null && (
                <div className="flex items-center gap-0.5">
                  <span className="text-[10px] font-bold text-blue-400">↓</span>
                  <span className="text-xs text-gray-500">
                    {formatTemp(w.tempMin)}
                  </span>
                </div>
              )}

              {/* Label mo ta nho */}
              <span className={`mt-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${style.badge}`}>
                {getWeatherLabel(w.condition)}
              </span>

              {/* Tooltip hover: chi tiet mua */}
              {w.precipitationMm != null && w.precipitationMm > 0 && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                  <Droplets className="w-3 h-3 inline mr-1 text-blue-300" />
                  Lượng mưa: {w.precipitationMm.toFixed(1)}mm
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Hang thu 2 neu co nhieu ngay */}
      {withDayOfWeek.length > 4 && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {withDayOfWeek.slice(4, 8).map((w, idx) => {
            const style = getWeatherStyle(w.condition)
            return (
              <div
                key={idx + 4}
                className={`flex flex-col items-center py-2.5 px-1 rounded-xl border transition-all hover:-translate-y-0.5 ${style.bg} opacity-80`}
              >
                <span className="text-xs font-bold text-gray-500 mb-1">{w.dayLabel}</span>
                <div className="scale-75">{style.icon}</div>
                <span className={`text-xs font-bold ${style.text}`}>{formatTemp(w.temp)}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer nguon du lieu */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Wind className="w-3.5 h-3.5" />
          <span>Nguồn: Open-Meteo</span>
        </div>
        <span className="text-xs text-gray-300">Cập nhật tự động</span>
      </div>
    </div>
  )
}
