# Cách kết nối với mongodb với Design Patterns Singleton

        class Database {
            constructor() {
                this.connect();
            }

        connect(type = "mongodb") {
            const connectUrl =
            process.env.URI_MONGODB || "mongodb://localhost:27017/shopDEV"; // Thay đổi URI kết nối tới MongoDB tại đây
            const options = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            };

            if (1 === 1) {
                mongoose.set("debug", true);
                mongoose.set("debug", { color: true });
            }

        mongoose
            .connect(connectUrl, options)
            .then(() => {
                console.log("Connected to MongoDB Success Pro!!");
            })
            .catch((error) => {
                console.error("Error connecting to MongoDB:", error);
            });
        }

        static getInstance() {
            if (!Database.instance) {
                Database.instance = new Database();
            }
                return Database.instance;
            }
        }

# Sự khác nhau giữa file helpers và utils

    - Đều dùng chứa các func tiện ích để tái sử dụng trong toàn bộ dự án

    - Sự khác nhau:
        | Utils | Helpers |
        | ------ | ------ |
        | Thường chứa các func hoặc các lớp tiện ích cung cấp các chức năng hữu ích cho các thành phần khác trong dự án | Helper là một file ủy quyền giúp chúng ta làm được nhiều việc hơn. Thường được sử dụng để lưu trữ các func trợ giúp cho phần mềm, nhằm hỗ trợ các chức năng cụ thể của các thành phần |
        |Thường được sử dụng thường xuyên trong dự án|Khi nào cần thì sẽ được gọi|
        |VD: Chuyển đổi ký tự in hoa -> in thường, định dạng ngày tháng... | VD: Xử lý địa chỉ IP, xử lý các truy vấn cơ sở dữ liệu...|

        1. Utils (Utilities):
            - Chứa các hàm hỗ trợ độc lập, không liên quan trực tiếp đến một phần cụ thể của ứng dụng.
            - Thường là các hàm toàn cục có thể được sử dụng trong nhiều phần của dự án.
            - Cung cấp các chức năng chung, ví dụ: định dạng ngày tháng, xử lý chuỗi, chuyển đổi dữ liệu, mã hóa/giải mã, kiểm tra hợp lệ, v.v.
        2. Helpers (Helper Methods):
            - Chứa các phương thức hỗ trợ cho một phần cụ thể của ứng dụng hoặc một tác vụ cụ thể.
            - Thường được liên kết chặt chẽ với logic và quy trình trong một phần cụ thể của ứng dụng.
            - Cung cấp các chức năng hỗ trợ cụ thể, ví dụ: xử lý yêu cầu HTTP, xử lý dữ liệu cơ sở dữ liệu, xử lý luồng dữ liệu, xử lý tương tác với bên thứ ba, v.v.
