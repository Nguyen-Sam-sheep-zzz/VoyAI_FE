"use client"

import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix icon lỗi của Leaflet trong Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

// Tạo icon đánh số
const createNumberedIcon = (number: number) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: #f97316; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${number}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

interface Activity {
  id: string
  title: string
  lat: number
  lng: number
}

interface TripMapProps {
  activities: Activity[]
}

// Component phụ để tự động center map khi data thay đổi
function MapUpdater({ activities }: { activities: Activity[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (activities.length > 0) {
      const bounds = L.latLngBounds(activities.map(a => [a.lat, a.lng]))
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [activities, map])

  return null
}

export default function TripMap({ activities }: TripMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center">Đang tải bản đồ...</div>

  // Chỉ render marker cho activities có tọa độ hợp lệ
  // Activity mới thêm chưa có location sẽ không crash bản đồ
  const validActivities = activities.filter(
    a => a.lat != null && a.lng != null && a.lat !== 0 && a.lng !== 0
  )

  const positions = validActivities.map(a => [a.lat, a.lng] as [number, number])

  // Center mặc định nếu không có điểm nào
  const defaultCenter = validActivities.length > 0
    ? [validActivities[0].lat, validActivities[0].lng]
    : [1.3521, 103.8198]

  return (
    <div className="w-full h-[400px] xl:h-[500px] rounded-2xl overflow-hidden shadow-sm border border-orange-100 relative z-0">
      <MapContainer 
        center={defaultCenter as [number, number]} 
        zoom={12} 
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater activities={validActivities} />

        {validActivities.map((activity, index) => (
          <Marker 
            key={activity.id} 
            position={[activity.lat, activity.lng]}
            icon={createNumberedIcon(index + 1)}
          >
            <Popup>
              <div className="font-semibold text-sm">{activity.title}</div>
              <div className="text-xs text-gray-500 mt-0.5">Điểm #{index + 1}</div>
            </Popup>
          </Marker>
        ))}

        {positions.length > 1 && (
          <Polyline 
            positions={positions} 
            color="#f97316" 
            weight={3} 
            opacity={0.7} 
            dashArray="8, 8" 
          />
        )}
      </MapContainer>
      
      {/* Hien thi so luong diem tren ban do */}
      <div className="absolute top-2 right-2 z-[400] bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 shadow-sm border border-gray-100 pointer-events-none">
        {validActivities.length} điểm trên bản đồ
      </div>
    </div>
  )
}
