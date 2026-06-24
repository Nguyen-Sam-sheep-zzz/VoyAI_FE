"use client";

import { useAuthStore } from "@/src/store/authStore";
import { LogOut, User, Compass } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ProfileModal } from "@/components/auth/profile-modal";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const loginUrl = pathname && !pathname.startsWith("/login")
    ? `/login?redirect=${encodeURIComponent(pathname)}`
    : "/login";

  // Reset avatar error when user avatar changes
  useEffect(() => {
    setAvatarError(false);
  }, [user?.avatarUrl]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getInitial = () => {
    return user?.fullName ? user.fullName.charAt(0).toUpperCase() : "?";
  };

  const showAvatar = user?.avatarUrl && !avatarError;

  return (
    <header className="bg-white border-b border-orange-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">✈</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            VoyAI
          </h1>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex gap-8">
          <Link href="/" className="text-gray-600 hover:text-amber-600 font-medium transition-colors">
            Trang Chủ
          </Link>
          {isAuthenticated && (
            <Link href="/trips" className="text-gray-600 hover:text-amber-600 font-medium transition-colors">
              Chuyến Đi Của Tôi
            </Link>
          )}
          <a href="#" className="text-gray-600 hover:text-amber-600 font-medium transition-colors">
            Địa Điểm
          </a>
          <a href="#" className="text-gray-600 hover:text-amber-600 font-medium transition-colors">
            Về Chúng Tôi
          </a>
        </nav>

        {/* User Auth Section */}
        {isAuthenticated ? (
          <div className="relative" ref={dropdownRef}>
            {/* Clickable Profile Trigger - GitHub style (Avatar only) */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              type="button"
              className="w-10 h-10 rounded-full overflow-hidden shadow-xs border border-orange-100 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer select-none focus:outline-hidden focus:ring-2 focus:ring-amber-500/40"
            >
              {showAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt="avatar"
                  className="w-10 h-10 object-cover rounded-full"
                  onError={() => setAvatarError(true)}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-base font-semibold font-sans">
                  {getInitial()}
                </div>
              )}
            </button>

            {/* Dropdown Menu - GitHub style */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                {/* Signed in as */}
                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                  <p className="text-[11px] font-medium text-gray-400">Đã đăng nhập với</p>
                  <p className="text-sm font-bold text-gray-700 truncate mt-0.5" title={user?.email}>
                    {user?.email}
                  </p>
                </div>

                {/* Menu Items */}
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  type="button"
                  className="w-full text-left px-4 py-1.5 text-sm text-gray-600 hover:bg-orange-50/50 hover:text-orange-600 font-medium flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <User size={16} className="text-gray-400" />
                  Thông tin cá nhân
                </button>

                <Link
                  href="/trips"
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full text-left px-4 py-1.5 text-sm text-gray-600 hover:bg-orange-50/50 hover:text-orange-600 font-medium flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Compass size={16} className="text-gray-400" />
                  Chuyến đi của tôi
                </Link>

                <div className="border-t border-gray-50 my-1"></div>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  type="button"
                  className="w-full text-left px-4 py-1.5 text-sm text-red-500 hover:bg-red-50/60 font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut size={16} className="text-red-400" />
                  Đăng xuất
                </button>
              </div>
            )}

            {/* Profile Modal */}
            <ProfileModal
              isOpen={isProfileModalOpen}
              onClose={() => setIsProfileModalOpen(false)}
            />
          </div>
        ) : (
          <Link
            href={loginUrl}
            className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow inline-block text-center"
          >
            Đăng Nhập
          </Link>
        )}
      </div>
    </header>
  );
}
