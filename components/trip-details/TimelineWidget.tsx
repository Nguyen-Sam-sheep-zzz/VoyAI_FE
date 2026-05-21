"use client"

import { useRef, useState, MouseEvent } from "react"
import { ArrowRight } from "lucide-react"

interface TimelineWidgetProps {
  days: any[]
}

const DAY_COLORS = [
  { header: "bg-orange-100 text-orange-700", border: "border-orange-200 hover:border-orange-400", badge: "bg-orange-50 text-orange-600", line: "bg-orange-200" },
  { header: "bg-emerald-100 text-emerald-700", border: "border-emerald-200 hover:border-emerald-400", badge: "bg-emerald-50 text-emerald-600", line: "bg-emerald-200" },
  { header: "bg-blue-100 text-blue-700", border: "border-blue-200 hover:border-blue-400", badge: "bg-blue-50 text-blue-600", line: "bg-blue-200" },
  { header: "bg-purple-100 text-purple-700", border: "border-purple-200 hover:border-purple-400", badge: "bg-purple-50 text-purple-600", line: "bg-purple-200" },
]

export default function TimelineWidget({ days }: TimelineWidgetProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Xử lý kéo chuột để cuộn ngang mượt mà (không cần thanh cuộn)
  const handleMouseDown = (e: MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseLeave = () => setIsDragging(false)
  const handleMouseUp = () => setIsDragging(false)
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2 // Tốc độ cuộn
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-orange-100/50 relative overflow-hidden">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">Timeline chuyến đi</h3>
          <span className="text-xs font-medium text-gray-400 italic">
            Kéo chuột sang ngang để xem toàn bộ lịch trình
          </span>
        </div>
        
        {/* Container cuộn ngang ẩn thanh cuộn */}
        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex items-center gap-3 overflow-x-auto pb-4 pt-2 scrollbar-hide select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {days.map((day, dayIdx) => {
            const colorTheme = DAY_COLORS[dayIdx % DAY_COLORS.length]
            const isLastDay = dayIdx === days.length - 1
            
            return (
              <div key={day.id} className="flex items-center shrink-0">
                
                {/* Thẻ đánh dấu Ngày */}
                <div className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm ${colorTheme.header} mr-2`}>
                  {day.title}
                </div>
                
                {/* Danh sách các điểm trong ngày */}
                {day.activities.map((act: any, actIdx: number) => {
                  const isLastActInDay = actIdx === day.activities.length - 1

                  return (
                    <div key={act.id} className="flex items-center shrink-0">
                      <div className={`group relative flex items-center gap-1.5 px-3 py-1.5 bg-white border ${colorTheme.border} rounded-xl text-sm font-medium text-gray-700 shadow-sm transition-all hover:-translate-y-0.5`}>
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${colorTheme.badge}`}>
                          {act.time}
                        </span>
                        <span className="max-w-[150px] truncate">{act.title}</span>
                        
                        {/* Tooltip khi hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] whitespace-normal text-center px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          {act.title}
                        </div>
                      </div>
                      
                      {/* Dấu gạch nối giữa các điểm trong cùng 1 ngày */}
                      {!isLastActInDay && (
                        <div className={`w-6 h-0.5 ${colorTheme.line} mx-1 rounded-full`} />
                      )}
                    </div>
                  )
                })}
                
                {/* Dấu nối sang ngày tiếp theo (Mũi tên xám mờ dài) */}
                {!isLastDay && (
                  <div className="flex items-center px-3 mx-1">
                    <ArrowRight className="w-5 h-5 text-gray-300" strokeWidth={2} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
