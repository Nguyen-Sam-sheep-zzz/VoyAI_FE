# Kế hoạch Triển khai Đăng Nhập / Đăng Ký & Đăng nhập Google

Theo yêu cầu của bạn, chúng ta sẽ tạm hoãn phần Admin và ưu tiên hoàn thiện tính năng Xác thực người dùng (Auth) trước.

## 1. Giao diện (Frontend - Next.js)

*   **Modal Đăng Nhập/Đăng Ký**: Thay vì chuyển sang một trang hoàn toàn mới, ta sẽ làm một **Cửa sổ nổi (Modal/Dialog)** đẹp mắt hiện lên giữa màn hình khi bấm nút "Đăng Nhập" ở Header.
*   **Thiết kế (UI/UX)**: Đảm bảo phong cách đồng bộ với trang web hiện tại (Dùng màu cam/amber ấm áp, bo góc tròn, hiệu ứng glassmorphism mờ nhẹ).
*   **Chức năng trong Modal**:
    *   Form Đăng nhập truyền thống (Email / Password).
    *   Form Đăng ký truyền thống.
    *   Nút chuyển đổi mượt mà giữa Đăng nhập / Đăng ký.
    *   **Nút "Đăng nhập bằng Google"** nổi bật.
*   **Thư viện**: Sử dụng `@react-oauth/google` để tích hợp chuẩn nút Đăng nhập Google của Google Identity Services.

## 2. Xử lý Logic (Backend - Spring Boot)

Hệ thống Backend của bạn **đã có sẵn nền tảng cực kỳ tốt**: Đã có `User` model (có trường `provider`, `avatarUrl`), đã có JWT (JSON Web Token), đã có `/api/auth/register` và `/api/auth/login`.

Chúng ta chỉ cần làm thêm phần Google:
*   **Thêm Thư viện**: Thêm `google-api-client` vào `build.gradle` để Backend có thể xác thực token do Google gửi về một cách bảo mật.
*   **Tạo API Mới**: `POST /api/auth/google`
    *   Frontend sẽ gửi `idToken` của Google lên API này.
    *   Backend gọi lên server Google để giải mã và xác thực `idToken`.
    *   Lấy ra `email`, `name`, `picture` từ token.
    *   Kiểm tra Database:
        *   Nếu email đã tồn tại: Cấp luôn JWT Token của hệ thống (đăng nhập thành công).
        *   Nếu email chưa tồn tại: Tự động tạo một User mới với `provider = "google"`, `avatarUrl = picture` và cấp JWT Token.
