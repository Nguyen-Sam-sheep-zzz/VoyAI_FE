"use client";

import { Plane, Map, Compass, Globe2, Luggage, Camera } from "lucide-react";
import { useEffect, useState } from "react";

export function TravelBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Nền cơ bản màu cam nhẹ */}
      <div className="absolute inset-0 bg-orange-50/50"></div>
      
      {/* Vùng mờ ảo (Glow) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-300 rounded-full blur-[120px] opacity-20"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-400 rounded-full blur-[120px] opacity-20"></div>

      {/* Các Icon trang trí */}
      <div className="absolute top-[10%] left-[10%] text-orange-600/10 rotate-12">
        <Plane size={120} strokeWidth={1} />
      </div>
      <div className="absolute top-[20%] right-[15%] text-orange-600/10 -rotate-12">
        <Compass size={150} strokeWidth={1} />
      </div>
      <div className="absolute bottom-[15%] left-[20%] text-amber-500/10 rotate-45">
        <Map size={100} strokeWidth={1} />
      </div>
      <div className="absolute bottom-[20%] right-[5%] text-amber-600/5 -rotate-45">
        <Globe2 size={200} strokeWidth={1} />
      </div>
      <div className="absolute top-[50%] left-[5%] text-orange-500/10 -rotate-12">
        <Camera size={80} strokeWidth={1} />
      </div>
      <div className="absolute top-[60%] right-[25%] text-orange-400/10 rotate-12">
        <Luggage size={90} strokeWidth={1} />
      </div>
    </div>
  );
}
