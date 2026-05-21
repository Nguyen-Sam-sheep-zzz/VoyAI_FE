"use client"

import { Share2, FileDown, Calendar, Wallet, MapPin, Check } from "lucide-react"
import { useState } from "react"

interface TripHeaderProps {
  title: string
  durationDays: number
  totalBudget: number
  startDate?: string
  endDate?: string
}

// Rut gon ten dia diem Nominatim qua dai:
// "Tokyo, Thủ đô, Kanto, Nhật Bản" -> "Tokyo, Nhật Bản"
function shortenLocationName(name: string): string {
  const parts = name.split(",").map(p => p.trim()).filter(Boolean)
  if (parts.length <= 2) return name
  // Lay phan dau (ten chinh) va phan cuoi (quoc gia)
  return `${parts[0]}, ${parts[parts.length - 1]}`
}

// Phan tach title: "Hà Nội → Singapore" hoac "Chuyến đi Singapore, ..."
function parseTripTitle(title: string) {
  // Truong hop co ky hieu mui ten
  if (title.includes("➔") || title.includes("→")) {
    const arrow = title.includes("➔") ? "➔" : "→"
    const [from, to] = title.split(arrow).map(p => p.trim())
    return {
      from: shortenLocationName(from),
      to: shortenLocationName(to),
      type: "arrow" as const,
    }
  }

  // Strip tat ca cac prefix co the gap
  // Dung startsWith thay vi regex de tranh bug Unicode tieng Viet (e.g. "ế" khac "ê")
  const PREFIXES = [
    "Chuyến đi ",
    "chuyến đi ",
    "Chuyen di ",
    "Trip to ",
    "trip to ",
  ]
  let cleaned = title
  for (const prefix of PREFIXES) {
    if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.slice(prefix.length)
      break
    }
  }

  return {
    from: null,
    to: shortenLocationName(cleaned),
    type: "single" as const,
  }
}

function formatBudget(budget: number): string {
  if (budget >= 1_000_000_000) return `${(budget / 1_000_000_000).toFixed(1)}tỷ`
  if (budget >= 1_000_000) return `${(budget / 1_000_000).toFixed(0)}tr`
  if (budget >= 1_000) return `${(budget / 1_000).toFixed(0)}k`
  return budget.toLocaleString("vi-VN")
}

export default function TripHeader({
  title,
  durationDays,
  totalBudget,
  startDate,
  endDate,
}: TripHeaderProps) {
  const parsed = parseTripTitle(title)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Lịch trình chuyến đi thông minh",
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      }
    } catch (err) {
      console.error("Error sharing:", err)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="bg-white rounded-2xl px-4 py-3 md:px-5 md:py-4 shadow-sm border border-gray-100 mb-6 print:border-none print:shadow-none print:mb-2 print:px-0 print:py-0">
      {/* Layout 1 hang: icon + title + stats + actions */}
      <div className="flex items-center gap-3">

        {/* Icon may bay */}
        <div className="shrink-0 w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100 print:hidden">
          <MapPin className="w-4 h-4 text-orange-500" />
        </div>

        {/* Title — gion + truncate, khong de de len nut */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            {parsed.type === "arrow" ? (
              <h1
                className="text-base md:text-lg font-bold text-gray-800 truncate print:text-2xl print:whitespace-normal"
                title={title}   /* tooltip hover hien full name */
              >
                <span className="text-gray-700">{parsed.from}</span>
                <span className="mx-1.5 text-gray-300 font-light print:text-gray-600">→</span>
                <span className="bg-gradient-to-r from-orange-600 to-rose-500 bg-clip-text text-transparent print:text-black">
                  {parsed.to}
                </span>
              </h1>
            ) : (
              <h1
                className="text-base md:text-lg font-bold text-gray-800 truncate print:text-2xl print:whitespace-normal"
                title={title}
              >
                <span className="text-gray-500 font-medium text-sm mr-1.5 print:text-gray-700">Chuyến đi</span>
                <span className="bg-gradient-to-r from-orange-600 to-rose-500 bg-clip-text text-transparent print:text-black">
                  {parsed.to}
                </span>
              </h1>
            )}
          </div>

          {/* Stats nhỏ bên dưới title */}
          <div className="flex items-center gap-3 mt-0.5">
            <div className="flex items-center gap-1 text-xs text-gray-500 print:text-sm print:text-gray-700">
              <Calendar className="w-3.5 h-3.5 text-emerald-500 shrink-0 print:hidden" />
              <span>{durationDays} ngày</span>
              {startDate && (
                <span className="text-gray-400 print:text-gray-600">
                  · {new Date(startDate).toLocaleDateString("vi-VN", { day: "numeric", month: "numeric" })}
                  {endDate && ` – ${new Date(endDate).toLocaleDateString("vi-VN", { day: "numeric", month: "numeric" })}`}
                </span>
              )}
            </div>
            <div className="w-px h-3 bg-gray-200 shrink-0 print:bg-gray-400" />
            <div className="flex items-center gap-1 text-xs text-gray-500 print:text-sm print:text-gray-700">
              <Wallet className="w-3.5 h-3.5 text-blue-500 shrink-0 print:hidden" />
              <span className="font-medium text-gray-700 print:text-black">Tổng chi phí: {formatBudget(totalBudget)}</span>
              <span className="text-gray-400 print:text-gray-600">VND</span>
            </div>
          </div>
        </div>

        {/* Action buttons — shrink-0 dam bao khong bi de */}
        <div className="flex items-center gap-2 shrink-0 ml-auto print:hidden">
          <button
            onClick={handleShare}
            title="Chia sẻ chuyến đi"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 md:px-3.5 md:py-2 border rounded-lg transition-all font-medium text-xs md:text-sm shadow-sm ${copied ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600'}`}
          >
            {copied ? <Check className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" /> : <Share2 className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />}
            <span className="hidden sm:inline">{copied ? "Đã copy!" : "Chia sẻ"}</span>
          </button>
          <button
            onClick={handlePrint}
            title="Xuất PDF"
            className="flex items-center gap-1.5 px-2.5 py-1.5 md:px-3.5 md:py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-lg transition-all font-medium text-xs md:text-sm shadow-sm"
          >
            <FileDown className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
            <span className="hidden sm:inline">Xuất PDF</span>
          </button>
        </div>
      </div>
    </div>
  )
}
