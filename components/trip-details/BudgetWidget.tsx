"use client"

import { Loader2, TrendingUp, CarFront, Utensils, Ticket, Bed, HelpCircle } from "lucide-react"

interface Activity {
  id: string
  title: string
  cost: number
}

interface Day {
  activities: Activity[]
}

interface BudgetWidgetProps {
  currentBudget: number
  totalBudget: number
  isRecalculating?: boolean
  days?: Day[]  // Nhan them de tinh % theo category thuc
}

// Phan loai activity theo tu khoa trong ten (heuristic)
type Category = "transport" | "food" | "attraction" | "accommodation" | "other"

const TRANSPORT_KEYWORDS = [
  "taxi", "xe", "bus", "máy bay", "tàu", "tram", "grab", "uber", "airport",
  "sân bay", "ga ", "bến", "shuttle", "ferry", "phà", "di chuyển", "chuyển",
]
const FOOD_KEYWORDS = [
  "ăn", "trưa", "tối", "sáng", "café", "cà phê", "nhà hàng", "quán",
  "buffet", "food", "dinner", "lunch", "breakfast", "coffee", "bar", "snack",
]
const ATTRACTION_KEYWORDS = [
  "tham quan", "bảo tàng", "chùa", "đền", "biển", "công viên", "vườn",
  "di tích", "cung", "lâu đài", "tháp", "hồ", "núi", "tour", "check-in",
  "shopping", "mua sắm", "chợ",
]
const ACCOMMODATION_KEYWORDS = [
  "khách sạn", "hotel", "hostel", "resort", "homestay", "villa",
  "check-in", "check-out", "phòng", "ở", "lưu trú",
]

function classifyActivity(title: string): Category {
  const lower = title.toLowerCase()
  if (TRANSPORT_KEYWORDS.some(k => lower.includes(k))) return "transport"
  if (FOOD_KEYWORDS.some(k => lower.includes(k))) return "food"
  if (ACCOMMODATION_KEYWORDS.some(k => lower.includes(k))) return "accommodation"
  if (ATTRACTION_KEYWORDS.some(k => lower.includes(k))) return "attraction"
  return "other"
}

const CATEGORY_CONFIG = {
  transport: {
    label: "Di chuyển",
    icon: <CarFront className="w-4 h-4" />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    bar: "bg-blue-400",
    border: "border-blue-100",
  },
  food: {
    label: "Ăn uống",
    icon: <Utensils className="w-4 h-4" />,
    color: "text-orange-600",
    bg: "bg-orange-50",
    bar: "bg-orange-400",
    border: "border-orange-100",
  },
  attraction: {
    label: "Tham quan",
    icon: <Ticket className="w-4 h-4" />,
    color: "text-purple-600",
    bg: "bg-purple-50",
    bar: "bg-purple-400",
    border: "border-purple-100",
  },
  accommodation: {
    label: "Lưu trú",
    icon: <Bed className="w-4 h-4" />,
    color: "text-teal-600",
    bg: "bg-teal-50",
    bar: "bg-teal-400",
    border: "border-teal-100",
  },
  other: {
    label: "Khác",
    icon: <HelpCircle className="w-4 h-4" />,
    color: "text-gray-500",
    bg: "bg-gray-50",
    bar: "bg-gray-300",
    border: "border-gray-100",
  },
}

function formatVND(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}tr`
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}k`
  return amount.toLocaleString("vi-VN")
}

export default function BudgetWidget({
  currentBudget,
  totalBudget,
  isRecalculating = false,
  days = [],
}: BudgetWidgetProps) {
  const percentage = totalBudget > 0 ? Math.min((currentBudget / totalBudget) * 100, 100) : 0
  const remaining = totalBudget - currentBudget
  const isOverBudget = currentBudget > totalBudget
  const isNearBudget = !isOverBudget && percentage > 80

  // Tinh tong chi phi theo category tu du lieu thuc
  const categoryTotals: Record<Category, number> = {
    transport: 0, food: 0, attraction: 0, accommodation: 0, other: 0,
  }

  const allActivities = days.flatMap(d => d.activities ?? [])
  allActivities.forEach(act => {
    if (act.cost > 0) {
      const cat = classifyActivity(act.title)
      categoryTotals[cat] += act.cost
    }
  })

  // Lay ra cac category co chi phi > 0 (an cac cat = 0 neu khong co)
  const activeCategories = (Object.entries(categoryTotals) as [Category, number][])
    .filter(([, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1])

  // Neu khong phan loai duoc gi -> fallback uoc tinh theo %
  const hasRealData = activeCategories.length > 0
  const totalCategorized = activeCategories.reduce((sum, [, v]) => sum + v, 0)

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-orange-100/50 flex flex-col gap-4 relative overflow-hidden">
      {/* Background blob */}
      <div className="absolute -top-8 -right-8 w-28 h-28 bg-emerald-50 rounded-full blur-2xl -z-10 pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
            Ngân sách
            {isRecalculating && <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {hasRealData ? "Tính từ hoạt động thực tế" : "Ước tính bởi AI"}
          </p>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold tabular-nums ${isOverBudget ? "text-red-600" : "text-gray-800"}`}>
            {formatVND(currentBudget)}đ
          </div>
          <div className="text-gray-400 text-xs font-medium">
            / {formatVND(totalBudget)}đ
          </div>
        </div>
      </div>

      {/* Progress bar tong */}
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>{Math.round(percentage)}% đã dùng</span>
          <span className={isOverBudget ? "text-red-500 font-medium" : isNearBudget ? "text-amber-500 font-medium" : "text-emerald-500 font-medium"}>
            {isOverBudget ? `Vượt ${formatVND(Math.abs(remaining))}đ` : `Còn ${formatVND(remaining)}đ`}
          </span>
        </div>
        <div className="relative h-2.5 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out ${
              isOverBudget
                ? "bg-gradient-to-r from-red-400 to-rose-500"
                : isNearBudget
                ? "bg-gradient-to-r from-amber-400 to-orange-500"
                : "bg-gradient-to-r from-emerald-400 to-teal-500"
            } ${isRecalculating ? "opacity-50" : "opacity-100"}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Phan loai chi phi */}
      <div className="space-y-2">
        {hasRealData ? (
          // Co du lieu thuc tu activities
          activeCategories.map(([cat, amount]) => {
            const cfg = CATEGORY_CONFIG[cat]
            const pct = totalCategorized > 0 ? Math.round((amount / totalCategorized) * 100) : 0
            return (
              <div key={cat} className={`flex items-center gap-2.5 p-2 rounded-xl border ${cfg.bg} ${cfg.border}`}>
                <div className={`${cfg.color} shrink-0`}>{cfg.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                    <span className="text-xs font-bold text-gray-700">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cfg.bar} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-600 shrink-0">
                  {formatVND(amount)}đ
                </span>
              </div>
            )
          })
        ) : (
          // Fallback: uoc tinh theo ti le pho bien
          [
            { cat: "transport" as Category, pct: 35 },
            { cat: "food" as Category, pct: 28 },
            { cat: "attraction" as Category, pct: 37 },
          ].map(({ cat, pct }) => {
            const cfg = CATEGORY_CONFIG[cat]
            const estimated = Math.round((totalBudget * pct) / 100)
            return (
              <div key={cat} className={`flex items-center gap-2.5 p-2 rounded-xl border ${cfg.bg} ${cfg.border}`}>
                <div className={`${cfg.color} shrink-0`}>{cfg.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                    <span className="text-xs font-bold text-gray-700">~{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/80 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${cfg.bar}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <span className="text-xs text-gray-400 shrink-0">~{formatVND(estimated)}đ</span>
              </div>
            )
          })
        )}
      </div>

      {/* Trang thai */}
      <div className={`text-sm font-semibold px-4 py-2 rounded-xl flex items-center justify-center gap-2 ${
        isOverBudget
          ? "bg-red-50 text-red-600"
          : isNearBudget
          ? "bg-amber-50 text-amber-700"
          : "bg-emerald-50 text-emerald-700"
      }`}>
        {isOverBudget ? "⚠️ Vượt ngân sách!" : isNearBudget ? "⚡ Gần đạt giới hạn" : `✅ Còn lại ${formatVND(remaining)}đ`}
      </div>
    </div>
  )
}
