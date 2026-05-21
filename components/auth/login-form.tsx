"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/src/store/authStore";
import axiosInstance from "@/src/lib/axios";
import { Loader2 } from "lucide-react";

interface LoginFormProps {
  setIsLogin: (val: boolean) => void;
  onSuccess: () => void;
}

export function LoginForm({ setIsLogin, onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginAction = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      loginAction(
        { userId: res.data.userId, email: res.data.email, fullName: res.data.fullName, avatarUrl: res.data.avatarUrl },
        res.data.accessToken
      );
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      setError("");
      const res = await axiosInstance.post("/auth/google", { token: credentialResponse.credential });
      loginAction(
        { userId: res.data.userId, email: res.data.email, fullName: res.data.fullName, avatarUrl: res.data.avatarUrl },
        res.data.accessToken
      );
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi đăng nhập Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Chào mừng trở lại</h2>
      <p className="text-gray-500 mb-8">Đăng nhập để tiếp tục kế hoạch du lịch của bạn</p>
      
      {error && <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <Input required type="email" placeholder="Nhập email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl h-11" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <Input required type="password" placeholder="Nhập mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl h-11" />
          <div className="flex justify-end mt-1.5">
            <a href="#" className="text-xs font-medium text-amber-600 hover:text-orange-600 hover:underline transition-colors">Quên mật khẩu?</a>
          </div>
        </div>
        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full h-11 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 active:scale-[0.98] text-white font-semibold text-base transition-all duration-300 shadow-[0_4px_14px_rgba(249,115,22,0.35)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.45)] hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:pointer-events-none"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            "Đăng Nhập"
          )}
        </Button>
      </form>

      <div className="mt-6 relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200/80"></div></div>
        <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500 font-medium">Hoặc</span></div>
      </div>

      <div className="mt-6 flex justify-center w-full relative h-11 group">
        {/* Custom Styled Google Button (Visual Only) */}
        <button
          type="button"
          className="absolute inset-0 w-full h-full rounded-xl border border-gray-200/80 bg-white group-hover:bg-gray-50/90 group-hover:border-gray-300 text-gray-700 font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-300 shadow-sm group-active:scale-[0.98] cursor-pointer pointer-events-none"
        >
          <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.23 2.705 1.266 6.645l3.999 3.12Z"
            />
            <path
              fill="#FBBC05"
              d="M1.266 6.645A12.01 12.01 0 0 0 0 12c0 1.936.46 3.765 1.266 5.355l4-3.12A7.118 7.118 0 0 1 4.91 12c0-1.636.56-3.136 1.482-4.355L2.392 4.525C2.01 5.176 1.266 6.645 1.266 6.645Z"
            />
            <path
              fill="#34A853"
              d="M12 19.091a7.077 7.077 0 0 1-6.734-4.855l-4 3.12A12 12 0 0 0 12 24c3.055 0 5.864-1.091 8.01-2.945l-3.955-3.055c-1.127.736-2.563 1.091-4.055 1.091Z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12c0-.818-.082-1.609-.236-2.373H12v4.582h6.436A5.556 5.556 0 0 1 16 17.891l3.955 3.055c2.31-2.146 3.535-5.3 3.535-8.946Z"
            />
          </svg>
          Đăng nhập với Google
        </button>

        {/* Hidden Official Google Login (Interactive Overlay) */}
        <div className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer pointer-events-auto [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:absolute [&_iframe]:inset-0 [&>div]:w-full [&>div]:h-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Đăng nhập Google thất bại")}
            useOneTap={false}
            theme="outline"
            size="large"
            width="100%"
            text="continue_with"
            shape="rectangular"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 md:hidden">
        <span className="text-gray-600 text-sm">Chưa có tài khoản?</span>
        <button onClick={() => setIsLogin(false)} className="text-orange-600 font-semibold text-sm">Đăng ký ngay</button>
      </div>
    </div>
  );
}
