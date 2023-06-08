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

| Utils                                                                                                         | Helpers                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thường chứa các func hoặc các lớp tiện ích cung cấp các chức năng hữu ích cho các thành phần khác trong dự án | Helper là một file ủy quyền giúp chúng ta làm được nhiều việc hơn. Thường được sử dụng để lưu trữ các func trợ giúp cho phần mềm, nhằm hỗ trợ các chức năng cụ thể của các thành phần |
| Thường được sử dụng thường xuyên trong dự án                                                                  | Khi nào cần thì sẽ được gọi                                                                                                                                                           |
| VD: Chuyển đổi ký tự in hoa -> in thường, định dạng ngày tháng...                                             | VD: Xử lý địa chỉ IP, xử lý các truy vấn cơ sở dữ liệu...                                                                                                                             |

    1. Utils (Utilities):
        - Chứa các hàm hỗ trợ độc lập, không liên quan trực tiếp đến một phần cụ thể của ứng dụng.
        - Thường là các hàm toàn cục có thể được sử dụng trong nhiều phần của dự án.
        - Cung cấp các chức năng chung, ví dụ: định dạng ngày tháng, xử lý chuỗi, chuyển đổi dữ liệu, mã hóa/giải mã, kiểm tra hợp lệ, v.v.
    2. Helpers (Helper Methods):
        - Chứa các phương thức hỗ trợ cho một phần cụ thể của ứng dụng hoặc một tác vụ cụ thể.
        - Thường được liên kết chặt chẽ với logic và quy trình trong một phần cụ thể của ứng dụng.
        - Cung cấp các chức năng hỗ trợ cụ thể, ví dụ: xử lý yêu cầu HTTP, xử lý dữ liệu cơ sở dữ liệu, xử lý luồng dữ liệu, xử lý tương tác với bên thứ ba, v.v.

# Check số lượng connetion đến mongodb

    Sử dụng [mongoose.connections.length]

# Check over load

    1. Nodejs os và process
        - os: cung cấp các phương thức để làm việc với hệ điều hành
            - os.platform(): Trả về tên nền tảng hệ điều hành (ví dụ: "win32", "linux", "darwin", ...).
            - os.arch(): Trả về kiến trúc của CPU (ví dụ: "x64", "arm", ...).
            - os.cpus(): Trả về thông tin về các CPU trên hệ thống.
            - os.totalmem(): Trả về tổng dung lượng bộ nhớ hệ thống (dalam bytes).
            - os.freemem(): Trả về dung lượng bộ nhớ còn trống trong hệ thống (dalam bytes).
            - os.hostname(): Trả về tên máy chủ của hệ thống.
            - os.networkInterfaces(): Trả về thông tin về các giao diện mạng trên hệ thống.
            - os.uptime(): Trả về thời gian hoạt động của hệ thống (dalam giây).

        -Process:là một đối tượng toàn cục cung cấp thông tin và tiện ích liên quan đến quá trình chạy của ứng dụng Node.js. Đối tượng process chứa các phương thức và thuộc tính để tương tác với môi trường và quản lý quá trình thực thi.
            - process.argv: Mảng chứa các đối số được truyền vào khi chạy ứng dụng Node.js, bao gồm tên của file script và các đối số khác.
            - process.env: Đối tượng chứa các biến môi trường.
            - process.cwd(): Trả về thư mục làm việc hiện tại của quá trình Node.js.
            - process.exit([code]): Kết thúc quá trình Node.js với mã thoát tùy ý (mặc định là 0).
            - process.pid: ID của quá trình hiện tại.
            - process.on(event, listener): Phương thức để gắn bộ lắng nghe sự kiện cho quá trình, ví dụ: process.on('exit', () => { ... }).
            - process.memoryUsage(): lấy thông tin về việc sử dụng bộ nhớ của quá trình hiện tại.
                - rss (Resident Set Size): Kích thước tổng của bộ nhớ được cấp phát cho quá trình hiện tại.
                - heapTotal: Kích thước tổng của vùng nhớ heap được cấp phát cho quá trình hiện tại.
                - heapUsed: Kích thước thực tế của vùng nhớ heap đã được sử dụng.
                - external: Kích thước bộ nhớ bên ngoài được sử dụng bởi các đối tượng JavaScript liên quan đến quá trình hiện tại.

# PoolSize là gì??

    - Là một option trong MongoDb cho phép giới hạn kết nối tối đa đến cơ sở dữ liệu MongoDb. Mặc định nếu không có thì maxPoolSize là 100.
