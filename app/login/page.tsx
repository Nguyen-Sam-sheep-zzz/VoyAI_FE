"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { SlidingPanel } from "@/components/auth/sliding-panel";
import { TravelBackground } from "@/components/auth/travel-background";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleSuccess = () => {
    const redirect = typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirect") || "/"
      : "/";
    router.push(redirect);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      
      <TravelBackground />
      
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-white hover:bg-orange-500 hover:border-orange-500 transition-all duration-300 z-30 font-medium bg-white/70 px-5 py-2.5 rounded-full backdrop-blur-md shadow-sm border border-gray-200/50 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Về trang chủ
      </Link>

      <div className="relative w-full max-w-5xl h-[650px] bg-white rounded-3xl shadow-2xl overflow-hidden flex shadow-orange-900/10 border border-white/80 z-10">
        
        {/* Nửa Trái: Form Đăng Ký (Luôn nằm ở bên trái, bị che đi nếu isLogin = true) */}
        <div className="absolute top-0 left-0 w-full md:w-1/2 h-full p-8 sm:p-12 flex flex-col justify-center">
          <RegisterForm setIsLogin={setIsLogin} />
        </div>

        {/* Nửa Phải: Form Đăng Nhập (Luôn nằm ở bên phải, bị che đi nếu isLogin = false) */}
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full p-8 sm:p-12 flex flex-col justify-center">
          <LoginForm setIsLogin={setIsLogin} onSuccess={handleSuccess} />
        </div>

        {/* Lớp Overlay Panel trượt (Chứa hình ảnh) */}
        <SlidingPanel isLogin={isLogin} setIsLogin={setIsLogin} />

      </div>
    </div>
  );
}
