**Các chức năng cho người dùng cuối (end-user)**
+ Đăng nhập / đăng xuất (có authen) (sử dụng author bằng token)
+ Hiển thị các hóa đơn theo từng tháng và kiểm tra tình trạng hóa đơn

**Các chức năng cho người quản trị web (web-admin)**
+ Đăng nhập / đăng xuất (có authen) (sử dụng author bằng token)
+ Check quyền phù hợp khi chuyển trang (middleware)
+ Quản lí phòng (CRUD)
+ Quản lí tiện ích (CRU có tính toán)
+ Thao tác Xóa: có hỏi trước khi xóa
+ Quản lí thanh toán (Read và In)
+ Quản lí tài khoản (CRD)
+ Chỉ quản lí mới có thể tạo tài khoản và cung cấp cho người dùng, có mã hóa mật khẩu khi tạo.
