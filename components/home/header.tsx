"use client";

import { useAuthStore } from "@/src/store/authStore";
import { LogOut, User, ChevronDown, UserCircle } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ProfileModal } from "@/components/auth/profile-modal";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
          <a href="#" className="text-gray-600 hover:text-amber-600 font-medium transition-colors">
            Trang Chủ
          </a>
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
            {/* Clickable Profile Trigger */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              type="button"
              className="flex items-center gap-2 hover:bg-gray-50/80 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer select-none group border border-transparent hover:border-gray-100 shadow-xs hover:shadow-sm"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden shadow-xs border border-orange-100 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-600 shrink-0">
                {user?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt="avatar" className="w-8 h-8 object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm font-semibold font-sans">
                    {getInitial()}
                  </div>
                )}
              </div>
              <span className="font-semibold text-gray-700 text-sm hidden md:block group-hover:text-amber-600 transition-colors">
                {user?.fullName}
              </span>
              <ChevronDown size={14} className="text-gray-400 group-hover:text-amber-600 transition-all duration-200 group-hover:translate-y-0.5" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-60 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                {/* User Info Header */}
                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tài khoản</p>
                  <p className="text-sm font-bold text-gray-800 truncate mt-0.5">{user?.fullName}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>

                {/* Menu Items */}
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50/50 hover:text-orange-600 font-medium flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <UserCircle size={18} className="text-gray-400" />
                  Thông tin cá nhân
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50/60 font-semibold flex items-center gap-2.5 transition-colors border-t border-gray-50 mt-1.5 pt-2.5 cursor-pointer"
                >
                  <LogOut size={18} className="text-red-400" />
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
            href="/login"
            className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow inline-block text-center"
          >
            Đăng Nhập
          </Link>
        )}
      </div>
    </header>
  );
}
