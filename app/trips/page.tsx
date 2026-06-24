"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Header from "@/components/home/header"
import Footer from "@/components/home/footer"
import { tripService } from "@/src/services/trip.service"
import { useAuthStore } from "@/src/store/authStore"
import type { Trip } from "@/src/types"
import { 
  Calendar, 
  MapPin, 
  Trash2, 
  Compass, 
  ArrowRight, 
  Globe, 
  Lock, 
  Plus, 
  Loader2, 
  AlertTriangle,
  CreditCard,
  Check,
  X
} from "lucide-react"

export default function MyTripsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const fetchTrips = async () => {
    setLoading(true)
    setError(null)
    try {
      const hasToken = typeof window !== "undefined" && Boolean(window.localStorage.getItem("accessToken"))
      const sessionId = typeof window !== "undefined" ? window.localStorage.getItem("sessionId") : null

      if (hasToken) {
        const data = await tripService.getMyTrips()
        setTrips(data)
      } else if (sessionId) {
        const data = await tripService.getGuestTrips(sessionId)
        setTrips(data)
      } else {
        setTrips([])
      }
    } catch (err: any) {
      console.error("Error fetching trips:", err)
      setError(err.response?.data?.message || "Không thể tải danh sách chuyến đi. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrips()
  }, [isAuthenticated])

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      await tripService.deleteTrip(id)
      setTrips(prev => prev.filter(t => t.id !== id))
      setDeleteConfirmId(null)
    } catch (err) {
      console.error("Error deleting trip:", err)
      alert("Không thể xóa chuyến đi. Vui lòng thử lại.")
    } finally {
      setDeletingId(null)
    }
  }

  const getDestinationGradient = (destination: string) => {
    const dest = destination.toLowerCase()
    if (dest.includes("hà nội") || dest.includes("hanoi") || dest.includes("sapa") || dest.includes("hà giang")) {
      return "from-amber-500 via-orange-500 to-red-500"
    }
    if (dest.includes("đà nẵng") || dest.includes("nha trang") || dest.includes("phú quốc") || dest.includes("biển") || dest.includes("beach")) {
      return "from-cyan-500 via-blue-500 to-indigo-500"
    }
    if (dest.includes("đà lạt") || dest.includes("dalat") || dest.includes("vườn") || dest.includes("garden")) {
      return "from-emerald-500 via-teal-500 to-cyan-500"
    }
    if (dest.includes("hồ chí minh") || dest.includes("saigon") || dest.includes("sài gòn")) {
      return "from-rose-500 via-pink-500 to-orange-500"
    }
    return "from-orange-400 via-amber-500 to-yellow-500"
  }

  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate) return "Chưa đặt ngày"
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : null
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'numeric', year: 'numeric' }
    const startStr = start.toLocaleDateString("vi-VN", options)
    if (end) {
      const endStr = end.toLocaleDateString("vi-VN", options)
      return `${startStr} - ${endStr}`
    }
    return startStr
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50/50 via-white to-white">
      <Header />
      
      <main className="flex-1 py-10 px-4 max-w-7xl mx-auto w-full">
        {/* Banner Alert for Guests */}
        {!isAuthenticated && (
          <div className="mb-8 p-4 bg-amber-50/80 backdrop-blur-md border border-amber-200/80 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-amber-800 shadow-sm transition-all duration-200 animate-in fade-in duration-350">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              <span className="font-medium text-amber-850">
                Bạn đang xem các lịch trình với tư cách <strong>Khách</strong> (chỉ lưu trên thiết bị này). Đăng nhập để bảo vệ lịch trình và đồng bộ mọi nơi!
              </span>
            </div>
            <Link 
              href="/login"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-xs transition-colors shrink-0 shadow-sm"
            >
              Đăng nhập ngay
            </Link>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Chuyến đi của tôi
            </h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base font-medium">
              Quản lý các kế hoạch du lịch thông minh đã tạo bởi VoyAI
            </p>
          </div>
          
          <Link 
            href="/"
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Tạo chuyến đi mới
          </Link>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 mb-8 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchTrips} className="font-semibold underline hover:text-red-800">Thử lại</button>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-[2rem] border border-gray-100 p-5 shadow-xs animate-pulse">
                <div className="h-36 bg-gray-200 rounded-2xl mb-4" />
                <div className="h-6 bg-gray-200 rounded-xl w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded-xl w-1/2 mb-4" />
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <div className="h-4 bg-gray-200 rounded-xl w-1/4" />
                  <div className="h-8 bg-gray-200 rounded-xl w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : trips.length === 0 ? (
          /* Empty State */
          <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-orange-100/50 p-10 md:p-16 text-center max-w-2xl mx-auto shadow-sm my-8 flex flex-col items-center">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 relative animate-bounce duration-1000">
              <Compass className="w-12 h-12 text-orange-500 animate-spin" style={{ animationDuration: '20s' }} />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full animate-ping" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Chưa có lịch trình du lịch nào</h2>
            <p className="text-gray-500 text-sm md:text-base mb-8 max-w-md leading-relaxed">
              Bạn chưa có kế hoạch nào được lưu trên tài khoản. Hãy bắt đầu lên kế hoạch cho kỳ nghỉ mơ ước của bạn cùng VoyAI ngay hôm nay!
            </p>
            <Link 
              href="/"
              className="flex items-center gap-2 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              Lên lịch trình với AI
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Grid list of trips */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map(trip => (
              <div 
                key={trip.id}
                className="group bg-white rounded-[2rem] border border-gray-100 hover:border-orange-200 hover:shadow-[0_15px_40px_rgba(249,115,22,0.06)] transition-all duration-300 overflow-hidden flex flex-col h-full relative"
              >
                {/* Header Card (dynamic gradient base on destination) */}
                <div className={`h-36 bg-gradient-to-br ${getDestinationGradient(trip.destinationName)} p-6 flex flex-col justify-between relative`}>
                  {/* Subtle map pattern inside card header */}
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1.2px,transparent_1.2px)] [background-size:16px_16px] pointer-events-none" />
                  
                  {/* Badges */}
                  <div className="flex justify-between items-start z-10">
                    <span className="text-[10px] font-bold text-white bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md tracking-wider uppercase">
                      {trip.numDays} Ngày
                    </span>
                    
                    <div className="flex gap-2">
                      {trip.isPublic ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-emerald-500/80 backdrop-blur-md px-2 py-0.5 rounded-md">
                          <Globe className="w-3 h-3" />
                          Công khai
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-gray-700/60 backdrop-blur-md px-2 py-0.5 rounded-md">
                          <Lock className="w-3 h-3" />
                          Riêng tư
                        </span>
                      )}
                      
                      {!isAuthenticated && (
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-200/90 backdrop-blur-md px-2 py-0.5 rounded-md animate-pulse">
                          Thiết bị
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Destination Info */}
                  <div className="z-10 text-white">
                    <h3 className="font-extrabold text-xl truncate tracking-tight" title={trip.destinationName}>
                      {trip.destinationName}
                    </h3>
                    <p className="text-white/80 text-xs mt-0.5 font-medium truncate">
                      {trip.title}
                    </p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Dates */}
                    <div className="flex items-center gap-3 text-gray-500">
                      <Calendar className="w-4 h-4 text-orange-400 shrink-0" />
                      <span className="text-xs font-semibold">
                        {formatDateRange(trip.startDate, trip.endDate)}
                      </span>
                    </div>

                    {/* Cost */}
                    <div className="flex items-center justify-between bg-gray-50/50 border border-gray-100 rounded-2xl p-3.5">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-amber-500" />
                        <span className="text-xs text-gray-500 font-medium">Ngân sách dự tính:</span>
                      </div>
                      <span className="text-sm font-bold text-gray-800">
                        {trip.budgetTotal != null 
                          ? `${Number(trip.budgetTotal).toLocaleString("vi-VN")} đ` 
                          : "Chưa đặt"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-3 mt-6 pt-5 border-t border-gray-50">
                    {/* Delete logic */}
                    {deleteConfirmId === trip.id ? (
                      <div className="flex items-center gap-2 w-full">
                        <span className="text-xs font-bold text-red-500 shrink-0">Xóa?</span>
                        <button 
                          onClick={() => handleDelete(trip.id)}
                          disabled={deletingId === trip.id}
                          className="flex-1 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          {deletingId === trip.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                          Xác nhận
                        </button>
                        <button 
                          onClick={() => setDeleteConfirmId(null)}
                          disabled={deletingId === trip.id}
                          className="px-3 py-2 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-500 rounded-xl transition-colors cursor-pointer"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => setDeleteConfirmId(trip.id)}
                          className="p-2.5 rounded-xl border border-red-100 text-red-400 hover:text-red-600 hover:bg-red-50/50 hover:border-red-200 transition-all duration-200 cursor-pointer"
                          title="Xóa chuyến đi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <Link
                          href={`/trips/${trip.id}`}
                          className="flex-1 py-2.5 px-4 bg-orange-50 hover:bg-orange-100/80 text-orange-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 group/btn"
                        >
                          Xem chi tiết
                          <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}
