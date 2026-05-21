export default function HeroSection() {
  return (
    <section className="pt-20 pb-12 px-4 bg-gradient-to-b from-amber-600 to-amber-500 text-white">
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-block mb-6 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
          <span className="text-sm font-semibold">✈️ Khám Phá Thế Giới</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Bắt Đầu Cuộc Phiêu Lưu
          <span className="block text-yellow-100 mt-2">Du Lịch Của Bạn</span>
        </h1>

        <p className="text-xl md:text-2xl text-amber-50 mb-8 max-w-2xl mx-auto leading-relaxed">
          Lên kế hoạch cho chuyến du lịch hoàn hảo với AI. Chỉ cần cho chúng tôi biết bạn muốn đi đâu, bao lâu và ngân
          sách của bạn.
        </p>

        <div className="flex justify-center gap-4">
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
            <span className="text-2xl">🗺️</span>
            <span className="text-sm font-medium">Hơn 195 Quốc Gia</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
            <span className="text-2xl">⭐</span>
            <span className="text-sm font-medium">5000+ Kế Hoạch</span>
          </div>
        </div>
      </div>
    </section>
  )
}
