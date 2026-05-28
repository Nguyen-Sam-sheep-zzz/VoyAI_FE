"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Clock, GripVertical, MapPin, Plus, Sparkles, Pencil, Trash2, Check, X } from "lucide-react"
import { placeService } from "@/src/services/place.service"

interface Activity {
  id: string
  time: string
  title: string
  description: string
  cost: number
  lat: number
  lng: number
}

interface Day {
  id: string
  title: string
  date?: string
  activities: Activity[]
}

interface ItineraryBoardProps {
  initialDays: Day[]
  onDataChange: (days: Day[]) => void
  isGuest?: boolean
  // Optional BE sync callbacks — chi truyen khi user da login
  onActivityAdded?: (dayId: string, activity: Omit<Activity, "id">) => Promise<{ id: string } | null>
  onActivityEdited?: (activityId: string, updates: Partial<Activity>) => Promise<void>
  onActivityDeleted?: (activityId: string) => Promise<void>
}

const DAY_COLORS = [
  { header: "bg-orange-100 text-orange-700", border: "border-orange-200", badge: "bg-orange-50 text-orange-600", dot: "text-orange-500", accentBg: "bg-orange-400" },
  { header: "bg-emerald-100 text-emerald-700", border: "border-emerald-200", badge: "bg-emerald-50 text-emerald-600", dot: "text-emerald-500", accentBg: "bg-emerald-400" },
  { header: "bg-blue-100 text-blue-700", border: "border-blue-200", badge: "bg-blue-50 text-blue-600", dot: "text-blue-500", accentBg: "bg-blue-400" },
  { header: "bg-purple-100 text-purple-700", border: "border-purple-200", badge: "bg-purple-50 text-purple-600", dot: "text-purple-500", accentBg: "bg-purple-400" },
]

// ─── Inline Edit Form ─────────────────────────────────────────────────────────
function ActivityEditForm({
  activity,
  colorTheme,
  onSave,
  onCancel,
}: {
  activity: Partial<Activity>
  colorTheme: typeof DAY_COLORS[0]
  onSave: (data: Partial<Activity>) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(activity.title ?? "")
  const [time, setTime] = useState(activity.time ?? "08:00")
  const [cost, setCost] = useState(activity.cost != null ? String(activity.cost) : "")
  const [description, setDescription] = useState(activity.description ?? "")
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => { titleRef.current?.focus() }, [])

  const handleSave = () => {
    if (!title.trim()) return
    onSave({
      ...activity,
      title: title.trim(),
      time,
      cost: Number(cost) || 0,
      description: description.trim(),
    })
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSave() }
    if (e.key === "Escape") onCancel()
  }

  return (
    <div className={`bg-white rounded-xl border-2 ${colorTheme.border} p-3.5 shadow-sm`} onKeyDown={handleKey}>
      <div className="space-y-2.5">
        {/* Ten hoat dong */}
        <input
          ref={titleRef}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Tên hoạt động *"
          className="w-full text-sm font-semibold text-gray-800 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-gray-400"
        />
        {/* Gio + Chi phi */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1 block">Giờ bắt đầu</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1 block">Chi phí (đ)</label>
            <input
              type="number"
              value={cost}
              onChange={e => setCost(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </div>
        {/* Mo ta */}
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Ghi chú thêm (tuỳ chọn)"
          rows={2}
          className="w-full text-xs text-gray-600 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none placeholder:text-gray-400"
        />
        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            Lưu
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-2 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Board ────────────────────────────────────────────────────────────────
export default function ItineraryBoard({
  initialDays,
  onDataChange,
  isGuest = false,
  onActivityAdded,
  onActivityEdited,
  onActivityDeleted,
}: ItineraryBoardProps) {
  const [days, setDays] = useState<Day[]>(initialDays)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const update = (newDays: Day[]) => {
    setDays(newDays)
    onDataChange(newDays)
  }

  // ─── Drag & Drop ──────────────────────────────────────────────────────────
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const newDays = [...days]
    const srcIdx = newDays.findIndex(d => d.id === source.droppableId)
    const dstIdx = newDays.findIndex(d => d.id === destination.droppableId)

    if (source.droppableId === destination.droppableId) {
      // Di chuyển trong cùng ngày
      const day = newDays[srcIdx]
      // Lấy danh sách giờ được sắp xếp tăng dần
      const sortedTimes = day.activities.map(a => a.time).sort((a, b) => a.localeCompare(b))

      const [moved] = day.activities.splice(source.index, 1)
      day.activities.splice(destination.index, 0, moved)

      // Gán lại giờ theo thứ tự mới
      day.activities = day.activities.map((activity, idx) => ({
        ...activity,
        time: sortedTimes[idx] || "08:00"
      }))
    } else {
      // Di chuyển sang ngày khác
      const srcDay = newDays[srcIdx]
      const dstDay = newDays[dstIdx]

      const [moved] = srcDay.activities.splice(source.index, 1)
      dstDay.activities.splice(destination.index, 0, moved)

      // Sắp xếp lại giờ của ngày nhận
      const sortedDstTimes = dstDay.activities.map(a => a.time).sort((a, b) => a.localeCompare(b))
      dstDay.activities = dstDay.activities.map((activity, idx) => ({
        ...activity,
        time: sortedDstTimes[idx] || "08:00"
      }))

      // Sắp xếp lại giờ của ngày gửi
      const sortedSrcTimes = srcDay.activities.map(a => a.time).sort((a, b) => a.localeCompare(b))
      srcDay.activities = srcDay.activities.map((activity, idx) => ({
        ...activity,
        time: sortedSrcTimes[idx] || "08:00"
      }))
    }

    update(newDays)
  }

  // ─── Them moi ─────────────────────────────────────────────────────────────
  const handleAdd = async (dayId: string, data: Partial<Activity>) => {
    const tempId = `local-${Date.now()}`

    let lat = 0;
    let lng = 0;
    try {
      const results = await placeService.searchPlace(data.title ?? "");
      if (results && results.length > 0) {
        lat = Number(results[0].lat);
        lng = Number(results[0].lon);
      }
    } catch (e) {
      // ignore
    }

    const newActivity: Activity = {
      id: tempId,
      title: data.title ?? "",
      time: data.time ?? "08:00",
      cost: data.cost ?? 0,
      description: data.description ?? "",
      lat,
      lng,
    }
    // 1. Cap nhat UI ngay (optimistic)
    const newDays = days.map(d =>
      d.id === dayId ? { ...d, activities: [...d.activities, newActivity] } : d
    )
    update(newDays)
    setEditingId(null)
    setSyncError(null)

    // 2. Sync len BE neu co callback (user da login)
    if (onActivityAdded) {
      try {
        const saved = await onActivityAdded(dayId, newActivity)
        if (saved?.id) {
          // Thay tempId bang real ID tu BE
          setDays(prev => prev.map(d => ({
            ...d,
            activities: d.activities.map(a => a.id === tempId ? { ...a, id: saved.id } : a),
          })))
        }
      } catch {
        setSyncError("Khong the luu hoat dong len server. Vui long thu lai.")
      }
    }
  }

  // ─── Chinh sua ────────────────────────────────────────────────────────────
  const handleEdit = async (actId: string, data: Partial<Activity>) => {
    let lat = data.lat;
    let lng = data.lng;

    const oldAct = days.flatMap(d => d.activities).find(a => a.id === actId);
    if (oldAct && oldAct.title !== data.title) {
      try {
        const results = await placeService.searchPlace(data.title ?? "");
        if (results && results.length > 0) {
          lat = Number(results[0].lat);
          lng = Number(results[0].lon);
        }
      } catch (e) {
        // ignore
      }
    }

    const newDays = days.map(d => ({
      ...d,
      activities: d.activities.map(a => a.id === actId ? { ...a, ...data, lat: lat ?? a.lat, lng: lng ?? a.lng } : a),
    }))
    update(newDays)
    setEditingId(null)
    setSyncError(null)

    // Sync BE neu co callback va activity co real ID (khong phai local temp)
    if (onActivityEdited && !actId.startsWith("local-")) {
      try {
        await onActivityEdited(actId, data)
      } catch {
        setSyncError("Khong the cap nhat hoat dong. Vui long thu lai.")
      }
    }
  }

  // ─── Xoa ──────────────────────────────────────────────────────────────────
  const handleDelete = async (actId: string) => {
    const newDays = days.map(d => ({
      ...d,
      activities: d.activities.filter(a => a.id !== actId),
    }))
    update(newDays)
    setConfirmDeleteId(null)
    setSyncError(null)

    // Sync BE neu co callback va khong phai local temp
    if (onActivityDeleted && !actId.startsWith("local-")) {
      try {
        await onActivityDeleted(actId)
      } catch {
        setSyncError("Khong the xoa hoat dong. Vui long thu lai.")
      }
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* Loi sync BE */}
      {syncError && (
        <div className="mb-4 px-4 py-3 bg-red-50/80 backdrop-blur-md border border-red-200/80 rounded-2xl flex items-center justify-between gap-2.5 text-xs text-red-700 shadow-sm transition-all duration-200">
          <span className="font-medium">⚠️ {syncError}</span>
          <button onClick={() => setSyncError(null)} className="text-red-400 hover:text-red-600 font-bold text-sm">&times;</button>
        </div>
      )}

      {/* Travel Grid & Soft Gradient Background Wrapper */}
      <div className="relative rounded-3xl p-5 md:p-6 bg-gradient-to-br from-orange-50/50 via-amber-50/20 to-white border border-orange-100/40 shadow-xs overflow-hidden min-h-[500px]">
        {/* Subtle grid decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(#fed7aa_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

        <div className="relative flex flex-col xl:flex-row gap-5 overflow-x-auto pb-6 pt-2 items-start custom-scrollbar print:flex-col print:overflow-visible print:gap-6">
          {days.map((day, dayIndex) => {
            const colorTheme = DAY_COLORS[dayIndex % DAY_COLORS.length]
            const isAddingToThisDay = editingId === `new-${day.id}`

            return (
              <div
                key={day.id}
                className="min-w-[310px] w-full xl:w-[310px] shrink-0 bg-white/75 backdrop-blur-md rounded-[2rem] p-4 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col hover:shadow-[0_12px_40px_rgba(249,115,22,0.04)] transition-[box-shadow,background-color] duration-300 print:w-full print:bg-white print:border-gray-200 print:shadow-none print:break-inside-avoid"
              >

                {/* Header cot ngay */}
                <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl mb-3.5 ${colorTheme.header}`}>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 opacity-70" />
                    {day.title}
                    {day.date && (
                      <span className="text-xs font-medium opacity-70">
                        {new Date(day.date).toLocaleDateString("vi-VN", { day: "numeric", month: "numeric" })}
                      </span>
                    )}
                  </h3>
                  <span className="text-xs font-semibold bg-white/40 px-2 py-0.5 rounded-md">
                    {day.activities.length} điểm
                  </span>
                </div>

                {/* Droppable area */}
                <Droppable droppableId={day.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 min-h-[100px] transition-[background-color,border-color] duration-200 rounded-2xl ${snapshot.isDraggingOver ? "bg-orange-50/20 ring-1 ring-inset ring-orange-200/50" : ""}`}
                    >
                      <div className="flex flex-col gap-3">
                        {day.activities.map((activity, index) => (
                          <Draggable key={activity.id} draggableId={activity.id} index={index} isDragDisabled={editingId === activity.id}>
                            {(provided, snapshot) => {
                              const cardContent = (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    transition: snapshot.isDragging ? "none" : provided.draggableProps.style?.transition,
                                  }}
                                >
                                  {/* Mode sua */}
                                  {editingId === activity.id ? (
                                    <div {...provided.dragHandleProps}>
                                      <ActivityEditForm
                                        activity={activity}
                                        colorTheme={colorTheme}
                                        onSave={data => handleEdit(activity.id, data)}
                                        onCancel={() => setEditingId(null)}
                                      />
                                    </div>
                                  ) : (
                                    <div
                                      className={`bg-white/95 rounded-2xl p-4 border ${snapshot.isDragging
                                          ? "shadow-2xl border-orange-300 ring-4 ring-orange-500/10 z-[9999] scale-[1.02]"
                                          : `shadow-xs hover:shadow-md border-gray-100 hover:${colorTheme.border} hover:scale-[1.01] transition-[border-color,box-shadow,transform] duration-200`
                                        } group relative overflow-hidden`}
                                      style={{
                                        width: snapshot.isDragging ? "278px" : "auto",
                                        maxWidth: "100%",
                                      }}
                                    >
                                      {/* Dai mau trang tri ben trai */}
                                      <div className={`absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity ${colorTheme.accentBg}`} />

                                      <div className="flex gap-3">
                                        {/* Handle keo tha */}
                                        <div
                                          {...provided.dragHandleProps}
                                          className="mt-1 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors shrink-0 print:hidden"
                                        >
                                          <GripVertical className="w-5 h-5" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center justify-between mb-2">
                                            <span className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-md ${colorTheme.badge}`}>
                                              <Clock className="w-3.5 h-3.5" />
                                              {activity.time}
                                            </span>
                                            {/* Action buttons - hien khi hover */}
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 bg-white/80 backdrop-blur-sm pl-2 print:hidden">
                                              {activity.cost > 0 && (
                                                <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded-md mr-1">
                                                  -{activity.cost.toLocaleString("vi-VN")}đ
                                                </span>
                                              )}
                                              <button
                                                onClick={() => setEditingId(activity.id)}
                                                title="Chỉnh sửa"
                                                className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                                              >
                                                <Pencil className="w-3.5 h-3.5" />
                                              </button>
                                              {confirmDeleteId === activity.id ? (
                                                <div className="flex items-center gap-1 bg-red-50 border border-red-200 rounded-lg px-2 py-1">
                                                  <span className="text-[10px] text-red-600 font-medium">Xoá?</span>
                                                  <button
                                                    onClick={() => handleDelete(activity.id)}
                                                    className="p-0.5 text-red-600 hover:text-red-700"
                                                  >
                                                    <Check className="w-3.5 h-3.5" />
                                                  </button>
                                                  <button
                                                    onClick={() => setConfirmDeleteId(null)}
                                                    className="p-0.5 text-gray-400 hover:text-gray-600"
                                                  >
                                                    <X className="w-3.5 h-3.5" />
                                                  </button>
                                                </div>
                                              ) : (
                                                <button
                                                  onClick={() => setConfirmDeleteId(activity.id)}
                                                  title="Xóa hoạt động"
                                                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                                >
                                                  <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                              )}
                                            </div>
                                          </div>

                                          <h4 className="font-semibold text-gray-800 text-sm truncate flex items-center gap-1.5">
                                            <MapPin className={`w-4 h-4 shrink-0 ${colorTheme.dot}`} />
                                            {activity.title}
                                          </h4>
                                          {activity.description && (
                                            <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                                              {activity.description}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );

                              if (snapshot.isDragging && isMounted && typeof window !== "undefined") {
                                return createPortal(cardContent, document.body);
                              }
                              return cardContent;
                            }}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>

                {/* Them dia diem inline */}
                <div className="mt-3.5">
                  {isAddingToThisDay ? (
                    <ActivityEditForm
                      activity={{}}
                      colorTheme={colorTheme}
                      onSave={data => handleAdd(day.id, data)}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <button
                      onClick={() => { setEditingId(`new-${day.id}`); setConfirmDeleteId(null) }}
                      className="w-full py-2.5 border border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50/30 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:text-orange-600 text-sm font-semibold transition-all group print:hidden cursor-pointer"
                    >
                      <Plus className="w-4 h-4 group-hover:scale-125 transition-transform" />
                      Thêm địa điểm
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </DragDropContext>
  )
}
