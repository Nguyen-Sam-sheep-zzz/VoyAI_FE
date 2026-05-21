export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">✈</span>
              </div>
              <span className="font-bold text-white">VoyAI</span>
            </div>
            <p className="text-sm text-gray-400">Lên kế hoạch chuyến du lịch tuyệt vời của bạn ngay hôm nay.</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Khám Phá</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-amber-500 transition-colors">
                  Điểm Đến
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500 transition-colors">
                  Kế Hoạch Mẫu
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500 transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Công Ty</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-amber-500 transition-colors">
                  Về Chúng Tôi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500 transition-colors">
                  Liên Hệ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500 transition-colors">
                  Việc Làm
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Pháp Lý</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-amber-500 transition-colors">
                  Điều Khoản Sử Dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500 transition-colors">
                  Chính Sách Riêng Tư
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500 transition-colors">
                  Cookie
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-400">© 2026 TravelPlan. Tất cả quyền được bảo vệ.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
              Facebook
            </a>
            <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
              Twitter
            </a>
            <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
