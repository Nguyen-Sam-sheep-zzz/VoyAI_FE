"use client";

import Image from "next/image";

interface SlidingPanelProps {
  isLogin: boolean;
  setIsLogin: (val: boolean) => void;
}

export function SlidingPanel({ isLogin, setIsLogin }: SlidingPanelProps) {
  return (
    <div 
      className={`hidden md:block absolute top-0 left-0 w-1/2 h-full z-20 transition-transform duration-500 ease-in-out ${!isLogin ? 'translate-x-full' : 'translate-x-0'}`}
    >
      <div className="relative w-full h-full overflow-hidden shadow-2xl">
        {/* Ảnh Phố Cổ Hội An (Hiện khi Register - Layer Dưới) */}
        {/* Để cross-fade mượt hơn, ảnh dưới luôn opacity-100, ảnh trên sẽ mờ dần */}
        <div className="absolute inset-0">
          <Image src="/auth-bg-register.png" alt="Hoi An Night" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-12 text-white">
            <h3 className="text-3xl font-bold mb-3 leading-tight">Bắt đầu<br/>hành trình mới</h3>
            <p className="text-white/80 font-light mb-8">Gia nhập cộng đồng đam mê xê dịch và tạo ra những kỷ niệm khó quên.</p>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Đã có tài khoản?</span>
              <button 
                onClick={() => setIsLogin(true)} 
                className="px-5 py-2 rounded-full border border-white/50 hover:bg-white hover:text-orange-600 transition-all text-sm font-semibold backdrop-blur-sm"
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </div>

        {/* Ảnh Vịnh Hạ Long (Hiện khi Login - Layer Trên) */}
        {/* Chỉ thay đổi opacity layer trên này. Cần pointer-events-none để không chặn click nút đăng nhập ở layer dưới */}
        <div className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${isLogin ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <Image src="/auth-bg-login.png" alt="Ha Long Bay" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10"></div>
          <div className="absolute bottom-0 left-0 w-full p-12 text-white">
            <h3 className="text-3xl font-bold mb-3 leading-tight">Khám phá<br/>thế giới cùng VoyAI</h3>
            <p className="text-white/80 font-light mb-8">Lên kế hoạch du lịch thông minh, tối ưu chi phí và thời gian chỉ với vài cú click.</p>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Chưa có tài khoản?</span>
              <button 
                onClick={() => setIsLogin(false)} 
                className="px-5 py-2 rounded-full border border-white/50 hover:bg-white hover:text-orange-600 transition-all text-sm font-semibold backdrop-blur-sm"
              >
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
