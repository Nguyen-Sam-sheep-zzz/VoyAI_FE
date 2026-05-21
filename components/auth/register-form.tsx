"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/src/lib/axios";
import { Loader2 } from "lucide-react";

interface RegisterFormProps {
  setIsLogin: (val: boolean) => void;
}

export function RegisterForm({ setIsLogin }: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      await axiosInstance.post("/auth/register", { email, password, fullName });
      setSuccessMsg("Đăng ký thành công! Vui lòng đăng nhập.");
      setTimeout(() => setIsLogin(true), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Tạo tài khoản</h2>
      <p className="text-gray-500 mb-8">Bắt đầu hành trình khám phá thế giới cùng VoyAI</p>
      
      {successMsg && <div className="p-3 bg-green-50 text-green-600 border border-green-200 rounded-xl text-sm mb-4">{successMsg}</div>}
      {error && <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
          <Input required placeholder="Nhập họ và tên" value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-xl h-11" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <Input required type="email" placeholder="Nhập email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl h-11" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <Input required type="password" placeholder="Tạo mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl h-11" />
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
            "Đăng Ký"
          )}
        </Button>
      </form>

      <div className="mt-8 flex items-center justify-center gap-2 md:hidden">
        <span className="text-gray-600 text-sm">Đã có tài khoản?</span>
        <button onClick={() => setIsLogin(true)} className="text-orange-600 font-semibold text-sm">Đăng nhập</button>
      </div>
    </div>
  );
}
