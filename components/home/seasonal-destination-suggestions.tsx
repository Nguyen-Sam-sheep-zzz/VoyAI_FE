"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Leaf, Loader2, Snowflake, Sun, Trees } from "lucide-react";
import {
  SEASON_LABELS,
  SEASONAL_DESTINATIONS,
  getSeasonFromDate,
  type SeasonId,
} from "@/lib/seasonal-destinations";
import { cn } from "@/lib/utils";

const SEASON_ICONS: Record<SeasonId, typeof Leaf> = {
  spring: Leaf,
  summer: Sun,
  autumn: Trees,
  winter: Snowflake,
};

interface SeasonalDestinationSuggestionsProps {
  /** Gọi API tìm địa điểm và điền form (trả về true nếu chọn được từ danh sách) */
  onPickPlace: (searchQuery: string) => Promise<boolean>;
  className?: string;
}

export default function SeasonalDestinationSuggestions({
  onPickPlace,
  className,
}: SeasonalDestinationSuggestionsProps) {
  const initialSeason = useMemo(() => getSeasonFromDate(), []);
  const [season, setSeason] = useState<SeasonId>(initialSeason);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const items = SEASONAL_DESTINATIONS[season];
  const seasonOrder: SeasonId[] = ["spring", "summer", "autumn", "winter"];

  return (
    <div className={cn("space-y-6 min-w-0 max-w-full flex flex-col", className)}>
      <div>
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900">🌸 Gợi ý theo mùa</h3>
        <p className="text-sm lg:text-[15px] text-gray-600 mt-2 leading-relaxed">
          Chọn một điểm đến — hệ thống sẽ tự tra tọa độ và điền vào ô Điểm đến giống như khi bạn chọn từ gợi ý tìm
          kiếm.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {seasonOrder.map((id) => {
          const Icon = SEASON_ICONS[id];
          const active = season === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setSeason(id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-amber-600 text-white shadow"
                  : "bg-orange-50 text-amber-900 hover:bg-orange-100 border border-orange-100"
              )}
            >
              <Icon size={14} className="shrink-0" aria-hidden />
              {SEASON_LABELS[id]}
            </button>
          );
        })}
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 flex-1">
        {items.map((d) => {
          const busy = pendingId === d.id;
          return (
            <li key={d.id} className="min-w-0 flex">
              <button
                type="button"
                disabled={Boolean(pendingId)}
                onClick={async () => {
                  setPendingId(d.id);
                  try {
                    await onPickPlace(d.searchQuery);
                  } finally {
                    setPendingId(null);
                  }
                }}
                className={cn(
                  "group w-full text-left rounded-xl overflow-hidden border border-orange-100 bg-white shadow-md hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 flex flex-col",
                  busy && "opacity-90"
                )}
              >
                <div
                  className={cn(
                    "relative w-full flex-1",
                    "aspect-[16/11] sm:aspect-[16/10] lg:aspect-auto lg:min-h-[220px]"
                  )}
                >
                  <Image
                    src={d.imageUrl}
                    alt={d.name}
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 flex items-end justify-between gap-2 min-w-0">
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-base lg:text-lg drop-shadow-sm truncate">{d.name}</p>
                      {d.tag && (
                        <p className="text-white/90 text-xs sm:text-sm mt-0.5 line-clamp-2 drop-shadow-sm">{d.tag}</p>
                      )}
                    </div>
                    {busy ? (
                      <Loader2 className="text-white shrink-0 animate-spin" size={22} aria-hidden />
                    ) : (
                      <span className="text-xs text-white/95 font-medium rounded-full bg-white/20 px-2 py-1 backdrop-blur-sm">
                        Chọn
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
