"use client";

import type React from "react";
import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState,
} from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { placeService } from "@/src/services/place.service";
import { tripService } from "@/src/services/trip.service";
import type { PlaceSearchResult, TripRequest } from "@/src/types";
import {
    Calendar,
    DollarSign,
    Loader2,
    MapPin,
    Navigation,
    Search,
    Sparkles,
    StickyNote,
    Pen,
} from "lucide-react";
import RequiredLabel from "@/components/required-label";
import GeneratingOverlay from "@/components/home/generating-overlay";

export type TravelFormHandle = {
    /** Tìm địa điểm theo chuỗi và áp dụng kết quả đầu tiên (cùng luật với chọn từ gợi ý). */
    applyPlaceFromQuery: (query: string) => Promise<boolean>;
};

interface TravelFormProps {
    onPlanCreated?: (plan: any) => void;
}

const TravelForm = forwardRef<TravelFormHandle, TravelFormProps>(function TravelForm(
    { onPlanCreated },
    ref
) {
    const router = useRouter();

    const [destination, setDestination] = useState("");
    const [placeId, setPlaceId] = useState("");
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);

    const [originName, setOriginName] = useState("");
    const [originLat, setOriginLat] = useState<number | null>(null);
    const [originLng, setOriginLng] = useState<number | null>(null);
    const [originSuggestions, setOriginSuggestions] = useState<PlaceSearchResult[]>([]);
    const [isSearchingOrigin, setIsSearchingOrigin] = useState(false);
    const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);

    const [days, setDays] = useState("");
    const [budget, setBudget] = useState("");
    const [notes, setNotes] = useState("");
    const [startDate, setStartDate] = useState("");
    const [suggestions, setSuggestions] = useState<PlaceSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");
    const [loadingStep, setLoadingStep] = useState(0);
    const [touched, setTouched] = useState({
        destination: false,
        days: false,
        budget: false,
        startDate: false,
    });

    const loadingMessages = useMemo(
        () => [
            "Đang xác định địa điểm...",
            "Đang lấy dự báo thời tiết điểm đến...",
            "AI đang thiết kế lịch trình tối ưu cho bạn...",
            "Đang tổng hợp điểm tham quan, chi phí và hoàn thiện...",
        ],
        []
    );

    useEffect(() => {
        const keyword = destination.trim();
        if (!showSuggestions || keyword.length < 2) {
            setSuggestions([]);
            setIsSearching(false);
            return;
        }
        setIsSearching(true);
        const timeoutId = window.setTimeout(async () => {
            try {
                const result = await placeService.searchPlace(keyword);
                setSuggestions(result);
            } catch {
                setSuggestions([]);
            } finally {
                setIsSearching(false);
            }
        }, 400);
        return () => window.clearTimeout(timeoutId);
    }, [destination, showSuggestions]);

    useEffect(() => {
        const keyword = originName.trim();
        // Không search nếu gõ tọa độ (dấu phẩy, số) hoặc quá ngắn
        if (!showOriginSuggestions || keyword.length < 2 || keyword.startsWith("Vị trí:")) {
            setOriginSuggestions([]);
            setIsSearchingOrigin(false);
            return;
        }
        setIsSearchingOrigin(true);
        const timeoutId = window.setTimeout(async () => {
            try {
                const result = await placeService.searchPlace(keyword);
                setOriginSuggestions(result);
            } catch {
                setOriginSuggestions([]);
            } finally {
                setIsSearchingOrigin(false);
            }
        }, 400);
        return () => window.clearTimeout(timeoutId);
    }, [originName, showOriginSuggestions]);

    useEffect(() => {
        if (!loading) {
            setLoadingStep(0);
            return;
        }
        const intervalId = window.setInterval(() => {
            setLoadingStep((prev) => {
                const nextStep = prev + 1;
                return nextStep >= loadingMessages.length ? prev : nextStep;
            });
        }, 3000);
        return () => window.clearInterval(intervalId);
    }, [loading, loadingMessages.length]);

    const validationErrors = {
        destination:
            !destination.trim()
                ? "Vui lòng nhập địa điểm."
                : !placeId || lat === null || lng === null
                    ? "Vui lòng chọn một địa điểm từ danh sách gợi ý."
                    : "",
        days:
            !days.trim()
                ? "Vui lòng nhập số ngày."
                : Number(days) <= 0
                    ? "Số ngày phải lớn hơn 0."
                    : "",
        budget: budget.trim() !== "" && Number(budget) < 100000 && Number(budget) !== 0 ? "Ngân sách tối thiểu là 100.000 VNĐ." : "",
        
        startDate: !startDate.trim() ? "Vui lòng chọn ngày khởi hành." : "",
    };

    const canSubmit =
        !validationErrors.destination &&
        !validationErrors.days &&
        !validationErrors.budget &&
        !validationErrors.startDate;

    const handleDestinationChange = (value: string) => {
        setDestination(value);
        setPlaceId("");
        setLat(null);
        setLng(null);
        setShowSuggestions(true);
        setServerError("");
    };

    const handleOriginChange = (value: string) => {
        setOriginName(value);
        setOriginLat(null);
        setOriginLng(null);
        setShowOriginSuggestions(true);
    };

    const handleSelectPlace = useCallback((item: PlaceSearchResult) => {
        setDestination(item.display_name ?? "");
        setPlaceId(String(item.place_id ?? ""));
        setLat(item.lat ? Number(item.lat) : null);
        setLng(item.lon ? Number(item.lon) : null);
        setShowSuggestions(false);
        setSuggestions([]);
    }, []);

    const handleSelectOrigin = useCallback((item: PlaceSearchResult) => {
        setOriginName(item.display_name ?? "");
        setOriginLat(item.lat ? Number(item.lat) : null);
        setOriginLng(item.lon ? Number(item.lon) : null);
        setShowOriginSuggestions(false);
        setOriginSuggestions([]);
    }, []);

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            setServerError("Trình duyệt không hỗ trợ định vị GPS.");
            return;
        }
        
        setIsSearchingOrigin(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    const result = await placeService.reversePlace(lat, lon);
                    if (result && result.display_name) {
                        setOriginName(result.display_name);
                        setOriginLat(lat);
                        setOriginLng(lon);
                    } else {
                        setOriginName(`Vị trí: ${lat.toFixed(4)}, ${lon.toFixed(4)}`);
                        setOriginLat(lat);
                        setOriginLng(lon);
                    }
                } catch (err) {
                    setOriginName(`Vị trí: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
                    setOriginLat(position.coords.latitude);
                    setOriginLng(position.coords.longitude);
                } finally {
                    setIsSearchingOrigin(false);
                }
            },
            (error) => {
                setIsSearchingOrigin(false);
                setServerError("Không thể lấy vị trí. Vui lòng cấp quyền truy cập vị trí hoặc nhập thủ công.");
            }
        );
    };

    const applyPlaceFromQuery = useCallback(
        async (query: string): Promise<boolean> => {
            const q = query.trim();
            if (!q) return false;
            setServerError("");
            try {
                const results = await placeService.searchPlace(q);
                if (results.length === 0) {
                    setServerError(
                        "Không tìm thấy địa điểm cho gợi ý này. Vui lòng nhập và chọn từ danh sách gợi ý tìm kiếm."
                    );
                    setDestination(q);
                    setPlaceId("");
                    setLat(null);
                    setLng(null);
                    setShowSuggestions(true);
                    setTouched((prev) => ({ ...prev, destination: true }));
                    return false;
                }
                handleSelectPlace(results[0]);
                return true;
            } catch {
                setServerError("Không thể tra cứu địa điểm lúc này. Vui lòng thử lại.");
                return false;
            }
        },
        [handleSelectPlace]
    );

    useImperativeHandle(ref, () => ({ applyPlaceFromQuery }), [applyPlaceFromQuery]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError("");
        setTouched({
            destination: true,
            days: true,
            budget: true,
            startDate: true,
        });

        if (!canSubmit || lat === null || lng === null) return;

        setLoading(true);
        try {
            const payload: TripRequest = {
                destination: destination.trim(),
                numDays: Number(days),
                budgetTotal: Number(budget || 0),
                notes: notes.trim() || undefined,
                startDate: startDate || undefined,
                placeId,
                lat,
                lng,
                originName: originName.trim() || undefined,
                originLat: originLat ?? undefined,
                originLng: originLng ?? undefined,
            };

            const hasToken = Boolean(window.localStorage.getItem("accessToken"));

            if (hasToken) {
                const trip = await tripService.createTrip(payload);
                onPlanCreated?.(trip);
                router.push(`/trips/${trip.id}`);
                return;
            }

            const guestSessionId = window.localStorage.getItem("sessionId") ?? undefined;
            const result = await tripService.createGuestTrip(payload, guestSessionId);
            if (result.sessionId) {
                window.localStorage.setItem("sessionId", result.sessionId);
            }
            onPlanCreated?.(result.trip);
            router.push(`/trips/${result.trip.id}`);
        } catch {
            setServerError("Không thể tạo kế hoạch lúc này. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-6 md:p-8 bg-white shadow-xl border-0 rounded-2xl min-w-0 max-w-full w-full overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-6 min-w-0 max-w-full">
                {/* Origin */}
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            <MapPin size={18} className="text-blue-600 inline mr-1" />
                            Điểm Xuất Phát (Tùy chọn)
                        </label>
                        <button
                            type="button"
                            onClick={handleGetCurrentLocation}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                            <Navigation size={12} />
                            Lấy vị trí của tôi
                        </button>
                    </div>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Ví dụ: Hà Nội, TP.HCM..."
                            value={originName}
                            onFocus={() => setShowOriginSuggestions(true)}
                            onChange={(e) => handleOriginChange(e.target.value)}
                            onBlur={() => {
                                window.setTimeout(() => setShowOriginSuggestions(false), 120);
                            }}
                            className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 h-12 pr-10"
                        />
                        {isSearchingOrigin ? (
                            <Loader2
                                size={18}
                                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-blue-500"
                            />
                        ) : (
                            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        )}
                    </div>
                    {showOriginSuggestions && originSuggestions.length > 0 && (
                        <div className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-md z-10 relative">
                            {originSuggestions.map((item) => (
                                <button
                                    key={`org-${item.place_id}`}
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => handleSelectOrigin(item)}
                                    className="flex w-full items-start gap-2 rounded-md px-3 py-2 text-left hover:bg-blue-50"
                                >
                                    <MapPin size={15} className="mt-0.5 shrink-0 text-blue-500" />
                                    <span className="text-sm text-gray-700">{item.display_name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Destination */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <RequiredLabel>
                            <MapPin size={18} className="text-amber-600 inline mr-1" />
                            Điểm Đến
                        </RequiredLabel>
                    </label>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Ví dụ: Paris, Hà Nội, Tokyo..."
                            value={destination}
                            onFocus={() => setShowSuggestions(true)}
                            onChange={(e) => handleDestinationChange(e.target.value)}
                            onBlur={() => {
                                setTouched((prev) => ({ ...prev, destination: true }));
                                window.setTimeout(() => setShowSuggestions(false), 120);
                            }}
                            className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 h-12 pr-10"
                        />
                        {isSearching ? (
                            <Loader2
                                size={18}
                                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-amber-500"
                            />
                        ) : (
                            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        )}
                    </div>
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-md">
                            {suggestions.map((item) => (
                                <button
                                    key={String(item.place_id)}
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => handleSelectPlace(item)}
                                    className="flex w-full items-start gap-2 rounded-md px-3 py-2 text-left hover:bg-amber-50"
                                >
                                    <Navigation size={15} className="mt-0.5 shrink-0 text-amber-500" />
                                    <span className="text-sm text-gray-700">{item.display_name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                    {touched.destination && validationErrors.destination ? (
                        <p className="mt-2 text-xs text-red-600">{validationErrors.destination}</p>
                    ) : (
                        <p className="text-xs text-gray-500 mt-2">
                            💡 Hãy chọn địa điểm từ danh sách gợi ý để hệ thống lấy đúng tọa độ.
                        </p>
                    )}
                </div>

                {/* 2 columns: Days + Start Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <RequiredLabel>
                                <Calendar size={16} className="text-amber-600 inline mr-1" />
                                Số Ngày
                            </RequiredLabel>
                        </label>
                        <Input
                            type="number"
                            placeholder="Ví dụ: 3"
                            min="1"
                            max="365"
                            value={days}
                            onChange={(e) => {
                                setDays(e.target.value);
                                setServerError("");
                            }}
                            onBlur={() => setTouched((prev) => ({ ...prev, days: true }))}
                            className="bg-gray-50 border-gray-200 text-gray-900 h-12"
                        />
                        {touched.days && validationErrors.days && (
                            <p className="mt-2 text-xs text-red-600">{validationErrors.days}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <RequiredLabel>
                                <Calendar size={16} className="text-amber-600 inline mr-1" />
                                Ngày Khởi Hành
                            </RequiredLabel>
                        </label>
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                setServerError("");
                            }}
                            onBlur={() => setTouched((prev) => ({ ...prev, startDate: true }))}
                            className="bg-gray-50 border-gray-200 text-gray-900 h-12"
                        />
                        {touched.startDate && validationErrors.startDate && (
                            <p className="mt-2 text-xs text-red-600">{validationErrors.startDate}</p>
                        )}
                    </div>
                </div>

                {/* Budget */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <RequiredLabel>
                            <DollarSign size={16} className="text-amber-600 inline" />
                            Ngân Sách (VND)
                        </RequiredLabel>
                    </label>
                    <Input
                        type="number"
                        placeholder="Ví dụ: 5000000"
                        min="0"
                        value={budget}
                        onChange={(e) => {
                            setBudget(e.target.value);
                            setServerError("");
                        }}
                        onBlur={() => setTouched((prev) => ({ ...prev, budget: true }))}
                        className="bg-gray-50 border-gray-200 text-gray-900 h-12"
                    />
                    {touched.budget && validationErrors.budget && (
                        <p className="mt-2 text-xs text-red-600">{validationErrors.budget}</p>
                    )}

                </div>

                {/* Notes */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Pen size={16} className="text-amber-600 inline mr-3" />
                        Ghi Chú Thêm
                    </label>
                    <div className="relative">
                        <StickyNote size={16} className="absolute left-3 top-3 text-amber-600 pointer-events-none" />
                        <textarea
                            placeholder="Ví dụ: Tôi thích du lịch mạo hiểm, tìm kiếm ẩm thực địa phương, thích chụp ảnh bình minh..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                            className="w-full min-w-0 max-w-full pl-9 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none box-border"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        ✍️ Ghi chú càng chi tiết, AI càng đề xuất chính xác theo sở thích của bạn.
                    </p>
                </div>

                {serverError && (
                    <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{serverError}</p>
                )}

                {!canSubmit && (
                    <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
                        Vui lòng điền đầy đủ các trường bắt buộc (có dấu *) và chọn địa điểm từ gợi ý.
                    </p>
                )}

                <Button
                    type="submit"
                    disabled={loading || !canSubmit}
                    className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin" />
                            Đang Tạo...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <Sparkles size={16} />
                            Tạo Kế Hoạch Du Lịch
                        </span>
                    )}
                </Button>
            </form>

            {/* Info Box */}
            <div className="mt-4 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                    <strong>💡 Mẹo:</strong> Hãy chi tiết trong phần ghi chú để nhận được các đề xuất tốt hơn dành riêng cho
                    chuyến đi của bạn.
                </p>
            </div>

            {/* Loading overlay */}
            {loading && (
                <GeneratingOverlay loadingStep={loadingStep} messages={loadingMessages} />
            )}
        </Card>
    );
});

TravelForm.displayName = "TravelForm";

export default TravelForm;