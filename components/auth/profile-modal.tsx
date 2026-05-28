"use client";

import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/src/store/authStore";
import axiosInstance from "@/src/lib/axios";
import { Loader2, X, Camera, CheckCircle, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, updateUser } = useAuthStore();
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setAvatarUrl(user.avatarUrl || "");
    }
    setError("");
    setSuccess(false);
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Allow up to 5MB file upload because we will compress it down anyway
    if (file.size > 5 * 1024 * 1024) {
      setError("Dung lượng ảnh tối đa là 5MB. Vui lòng chọn ảnh khác.");
      return;
    }

    setLoading(true);
    setError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to JPEG with 0.7 quality to get a very lightweight Base64 string (~10-30KB)
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          setAvatarUrl(compressedBase64);
        } else {
          setError("Không thể xử lý ảnh.");
        }
        setLoading(false);
      };
      img.onerror = () => {
        setError("Không thể đọc file ảnh.");
        setLoading(false);
      };
    };
    reader.onerror = () => {
      setError("Không thể đọc file ảnh.");
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await axiosInstance.put("/auth/profile", {
        fullName,
        avatarUrl,
      });

      // Update local store
      updateUser({
        fullName: res.data.fullName,
        avatarUrl: res.data.avatarUrl,
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin.");
    } finally {
      setLoading(false);
    }
  };

  const getInitial = () => {
    return fullName ? fullName.charAt(0).toUpperCase() : "?";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white/95 backdrop-blur-md w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 p-6">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h3>
          <p className="text-sm text-gray-500 mt-1">Cập nhật thông tin tài khoản và ảnh đại diện của bạn</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 text-green-600 border border-green-200 rounded-xl text-sm mb-4 flex items-center gap-2 animate-bounce">
            <CheckCircle size={18} className="text-green-500" />
            Cập nhật thông tin thành công!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-center gap-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            
            <button
              type="button"
              onClick={handleAvatarClick}
              className="relative group w-24 h-24 rounded-full overflow-hidden shadow-md border-2 border-orange-100 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center cursor-pointer transition-all hover:border-amber-400 focus:outline-hidden"
              title="Click để tải ảnh lên"
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={avatarUrl} 
                  alt="Avatar Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // If image fails to load, clear the URL to show initial fallback
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement?.querySelector('.avatar-fallback')?.classList.remove('hidden');
                  }}
                  referrerPolicy="no-referrer"
                />
              ) : null}
              {/* Fallback initial - shown when no avatar or image fails */}
              <div className={`w-full h-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-3xl font-bold font-sans avatar-fallback ${avatarUrl ? 'hidden' : ''}`}>
                {getInitial()}
              </div>
              
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera size={20} />
                <span className="text-[10px] mt-1 font-medium">Tải ảnh lên</span>
              </div>
            </button>
            
            <button
              type="button"
              onClick={handleAvatarClick}
              className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Upload size={12} />
              Chọn ảnh từ máy tính
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Địa chỉ Email</label>
              <Input 
                value={user.email} 
                disabled 
                className="bg-gray-50 text-gray-500 rounded-xl h-11 border-gray-200/80 cursor-not-allowed" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Họ và tên</label>
              <Input 
                required
                placeholder="Nhập họ và tên" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                className="rounded-xl h-11 border-gray-200/80 focus-visible:ring-amber-500/20" 
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold cursor-pointer active:scale-[0.98] transition-all"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading || success}
              className="flex-1 h-11 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-md shadow-orange-500/10 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-75 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
