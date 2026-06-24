"use client"

import { useState, useMemo, useEffect, useCallback, useRef } from "react"
import { useParams } from "next/navigation"
import dynamic from "next/dynamic"
import Header from "@/components/home/header"
import Footer from "@/components/home/footer"
import TripHeader from "@/components/trip-details/TripHeader"
import ItineraryBoard from "@/components/trip-details/ItineraryBoard"
import BudgetWidget from "@/components/trip-details/BudgetWidget"
import WeatherWidget from "@/components/trip-details/WeatherWidget"
import TimelineWidget from "@/components/trip-details/TimelineWidget"
import { tripService } from "@/src/services/trip.service"
import { activityService } from "@/src/services/activity.service"
import { mapBeTripToFe, type FeTripData, type FeTripDay } from "@/lib/trip-mapper"
import { AlertCircle, RefreshCw } from "lucide-react"

// Tat SSR cho Map vi leaflet dung object window
const TripMap = dynamic(() => import("@/components/trip-details/TripMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] xl:h-[500px] bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-gray-500">
      Đang tải bản đồ ... 
    </div>
  )
})

// Loading Skeleton
function TripLoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50/50 via-white to-white">
      <Header />
      <main className="flex-1 py-8 px-4 w-full">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded-xl w-1/2 mb-3" />
            <div className="h-5 bg-gray-100 rounded-xl w-1/4" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="flex gap-4 overflow-x-auto pb-4">
                {[1, 2].map(i => (
                  <div key={i} className="min-w-[280px] w-[280px] bg-gray-100 rounded-2xl p-4 animate-pulse shrink-0">
                    <div className="h-8 bg-gray-200 rounded-xl mb-4" />
                    {[1,2,3].map(j => (
                      <div key={j} className="h-20 bg-white rounded-xl mb-2 border border-gray-100" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="h-[300px] bg-gray-100 rounded-3xl animate-pulse" />
              <div className="h-36 bg-gray-100 rounded-3xl animate-pulse" />
              <div className="h-32 bg-gray-100 rounded-3xl animate-pulse" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

// Error State
function TripErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50/50 via-white to-white">
      <Header />
      <main className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Không thể tải lịch trình</h2>
          <p className="text-gray-500 text-sm mb-6">{message}</p>
          <button
            onClick={onRetry}
            className="flex items-center gap-2 mx-auto px-5 py-2.5 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Thu lai
          </button>
        </div>
      </main>
      <Footer />
    </div>
  )
}

// Main Page
export default function TripDetailsPage() {
  const params = useParams()
  const tripId = params?.id as string

  const [tripData, setTripData] = useState<FeTripData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRecalculating, setIsRecalculating] = useState(false)
  const [activeDayId, setActiveDayId] = useState<string | null>(null)

  const fetchTrip = useCallback(async () => {
    if (!tripId) return
    setLoading(true)
    setError(null)

    try {
      const id = Number(tripId)
      const hasToken = typeof window !== "undefined" && Boolean(window.localStorage.getItem("accessToken"))
      const sessionId = typeof window !== "undefined" ? window.localStorage.getItem("sessionId") : null

      if (hasToken) {
        const beTrip = await tripService.getTripById(id)
        setTripData(mapBeTripToFe(beTrip))
      } else if (sessionId) {
        const beTrip = await tripService.getGuestTripById(id, sessionId)
        setTripData(mapBeTripToFe(beTrip, sessionId))
      } else {
        setError("Phiên làm việc hết hạn. Vui lòng tạo lại kế hoạch.")
      }
    } catch {
      setError("Không thể tải dữ liệu lịch trình vui lòng thử lại. ")
    } finally {
      setLoading(false)
    }
  }, [tripId])

  useEffect(() => {
    fetchTrip()
  }, [fetchTrip])

  const reorderTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (reorderTimeoutRef.current) {
        clearTimeout(reorderTimeoutRef.current)
      }
    }
  }, [])

  const handleItineraryChange = useCallback((newDays: FeTripDay[], isReorder?: boolean) => {
    setTripData(prev => {
      if (!prev) return prev
      const newCurrentBudget = newDays
        .flatMap(d => d.activities)
        .reduce((sum, act) => sum + act.cost, 0)
      return { ...prev, days: newDays, currentBudget: newCurrentBudget }
    })

    if (!isReorder) return

    const hasToken = typeof window !== "undefined" && Boolean(window.localStorage.getItem("accessToken"))
    const sessionId = typeof window !== "undefined" ? window.localStorage.getItem("sessionId") : null

    if (reorderTimeoutRef.current) {
      clearTimeout(reorderTimeoutRef.current)
    }

    reorderTimeoutRef.current = setTimeout(() => {
      const reorderActivities = newDays
        .flatMap(d => d.activities)
        .filter(a => !a.id.startsWith("local-"))
        .map(a => ({
          id: Number(a.id),
          startTime: a.time.length === 5 ? `${a.time}:00` : a.time
        }))

      if (reorderActivities.length === 0) return

      setIsRecalculating(true)

      const syncPromise = hasToken
        ? activityService.reorderActivities({ activities: reorderActivities })
        : sessionId
          ? activityService.reorderActivitiesAsGuest({ activities: reorderActivities }, sessionId)
          : Promise.reject(new Error("No credentials found"))

      syncPromise
        .catch(err => console.warn("Reorder API error:", err))
        .finally(() => setIsRecalculating(false))
    }, 1200)
  }, [])

  // CRUD callbacks — chi goi BE khi user da login
  const hasToken = typeof window !== "undefined" && Boolean(window.localStorage.getItem("accessToken"))

  const handleActivityAdded = useCallback(async (dayId: string, activity: { title: string; time: string; cost: number; description: string }) => {
    try {
      const saved = await activityService.addActivity(Number(dayId), {
        title: activity.title,
        startTime: activity.time.length === 5 ? `${activity.time}:00` : activity.time,
        estimatedCost: activity.cost,
        description: activity.description,
      })
      return { id: String(saved.id) }
    } catch (e) {
      console.error("Add activity BE error:", e)
      return null
    }
  }, [])

  const handleActivityEdited = useCallback(async (activityId: string, updates: { title?: string; time?: string; cost?: number; description?: string }) => {
    await activityService.updateActivity(Number(activityId), {
      title: updates.title,
      startTime: updates.time ? `${updates.time}:00` : undefined,
      estimatedCost: updates.cost,
      description: updates.description,
    })
  }, [])

  const handleActivityDeleted = useCallback(async (activityId: string) => {
    await activityService.deleteActivity(Number(activityId))
  }, [])

  const mapActivities = useMemo(() => {
    if (!tripData) return []
    if (activeDayId) {
      const day = tripData.days.find(d => d.id === activeDayId)
      return day ? day.activities : []
    }
    return tripData.days.flatMap(d => d.activities)
  }, [tripData, activeDayId])

  if (loading) return <TripLoadingSkeleton />
  if (error || !tripData) return <TripErrorState message={error ?? "Không tìm thấy dữ liệu"} onRetry={fetchTrip} />

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50/50 via-white to-white print:bg-none print:bg-white">
      <div className="print:hidden">
        <Header />
      </div>

      <main className="flex-1 py-8 px-4 w-full">
        <div className="max-w-[1600px] mx-auto">

          <TripHeader
            title={tripData.title}
            durationDays={tripData.durationDays}
            totalBudget={tripData.totalBudget}
            startDate={tripData.startDate}
            endDate={tripData.endDate}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:flex print:flex-col print:gap-4">

            <div className="lg:col-span-8 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2 print:mb-1">
                <h2 className="text-xl font-bold text-gray-800">Lịch trình chi tiết : </h2>
                <div className="flex gap-2 flex-wrap print:hidden">
                  <button
                    onClick={() => setActiveDayId(null)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${!activeDayId ? "bg-orange-100 text-orange-700" : "bg-white text-gray-600 hover:bg-gray-100"}`}
                  >
                    Tất cả
                  </button>
                  {tripData.days.map(day => (
                    <button
                      key={day.id}
                      onClick={() => setActiveDayId(day.id)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeDayId === day.id ? "bg-orange-100 text-orange-700" : "bg-white text-gray-600 hover:bg-gray-100"}`}
                    >
                      {day.title}
                    </button>
                  ))}
                </div>
              </div>

              <ItineraryBoard
                initialDays={tripData.days}
                onDataChange={handleItineraryChange}
                isGuest={tripData.isGuest}
                {...(hasToken ? {
                  onActivityAdded: handleActivityAdded,
                  onActivityEdited: handleActivityEdited,
                  onActivityDeleted: handleActivityDeleted,
                } : {})}
              />
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="sticky top-24 flex flex-col gap-6 print:static print:gap-4">
                <div className="print:hidden">
                  <TripMap activities={mapActivities} />
                </div>

                <BudgetWidget
                  currentBudget={tripData.currentBudget}
                  totalBudget={tripData.totalBudget}
                  isRecalculating={isRecalculating}
                  days={tripData.days}
                />

                <WeatherWidget
                  weatherData={tripData.weather}
                  destLat={tripData.destLat}
                  destLng={tripData.destLng}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 print:mt-4 print:hidden">
            <TimelineWidget days={tripData.days} />
          </div>

        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  )
}
