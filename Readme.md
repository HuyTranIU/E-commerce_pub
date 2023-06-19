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

# Sự khác nhau giữa file .env với configs

    - env: Lưu trữ các biến môi trường trong ứng dụng. Lưu các thông tin nhạy cảm mà chúng ta không muốn mã hóa cứng vào trong code
    - configs: Dùng để cấu hình cho ứng dụng của chúng ta. Được lưu dưới dạng json, xml. Dùng để kiểm soát lưu trữ những cấu hình của chúng ta.
    1. File .env:
    - Định dạng: File .env là một file văn bản đơn giản, thường có định dạng key=value, trong đó key là tên biến và value là giá trị tương ứng.
    - Chức năng: File .env được sử dụng để lưu trữ các biến môi trường, như cấu hình kết nối đến cơ sở dữ liệu, cấu hình API keys, cấu hình thông tin bảo mật, và các cấu hình khác liên quan đến môi trường phát triển và triển khai ứng dụng.
    - Sử dụng: File .env được đọc và sử dụng bởi các thư viện và frameworks để cung cấp cấu hình cho ứng dụng. Thông thường, các giá trị trong file .env sẽ được đọc và gán vào biến môi trường trong quá trình chạy ứng dụng.

    2. Folder configs:
    - Định dạng: Folder configs là một thư mục chứa các file cấu hình, thường được tổ chức theo các module hoặc chức năng khác nhau của ứng dụng.
    - Chức năng: Folder configs được sử dụng để lưu trữ các file cấu hình như cấu hình của cơ sở dữ liệu, cấu hình của hệ thống, cấu hình của các bên thứ ba (như API, dịch vụ bên ngoài), và các cấu hình khác liên quan đến chức năng và cấu trúc của ứng dụng.
    - Sử dụng: Các file cấu hình trong folder configs thường được import và sử dụng bởi các module, services hoặc controllers trong quá trình khởi tạo và cấu hình ứng dụng.

# If Else & Switch

    - Style code:
        ```sh
        // Bad
            const isOldEnough = user => {
                return user?.age ?? 0 > 30 // 30 là gì?
            }

        //Good
            const AGE_REQUIREMENT = 30
            const isOldEnough = user => {
                    return user?.age ?? 0 > AGE_REQUIREMENT
                }
        ```

---

        //Bad
            const validateCreate = (create, isRobo) => {
                if(isRobo) {
                    todo...
                } else {
                    todo ...
                }
            }

        // Good
            const validateHuman = user => {
                todo ...
            }
            const validateCreate = create => {
                todo ...
            }

---

        // Bad
            if(user.age > 30 && user.name === 'H' && user.status === 3) {
                todo ...
            }

        // Good
        const isOk = user.age > 30 && user.name === 'H' && user.status === 3
        if(isOk) {
            todo ...
        }
    -----------------------------------------------------------------------------------------
        const isOk = user => {
            return (
                user.age > 30 &&
                user.name === 'H' &&
                user.status === 3
            )
        }
        if(isOk(user)) {
            todo ...
        }

---

```sh

    '100': 'Continue',
    '101': 'Switching Protocols',
    '102': 'Processing',
    '103': 'Early Hints',
    '200': 'OK',
    '201': 'Created',
    '202': 'Accepted',
    '203': 'Non-Authoritative Information',
    '204': 'No Content',
    '205': 'Reset Content',
    '206': 'Partial Content',
```

        // If Else: cho một số điều kiện nhỏ
        const reasonPhraseCode = (code) => {
            if(code === 100) {
                console.log('Continue')
            } else (code === 101) {
                console.log('Switching Protocols')
            }
            ...
        }

        // Switch: sử dụng cho điều kiện lớn hơn
        const reasonPhraseCode = code => {
            switch (code) {
                case 100:
                    console.log('Continue')
                    break
                case 101:
                    console.log('Switching Protocols')
                    break
                ...
                default:
                    console.log('No code')
            }
        }
    reasonPhraseCode(200)

---

    const reasonPhraseCode = {
        '100': 'Continue',
        '101': 'Switching Protocols',
        '102': 'Processing',
        '103': 'Early Hints',
        '200': 'OK',
        '201': 'Created',
        '202': 'Accepted',
        '203': 'Non-Authoritative Information',
        '204': 'No Content',
        '205': 'Reset Content',
        '206': 'Partial Content',
        'default': 'No Code'
    }
    const returnReasonPhraseCode = code => {
        console.log(reasonPhraseCode[code] || reasonPhraseCode['default'])
    }

    - Sử dụng new Map()
        const reasonPhraseCode = new Map([
            ['100', 'Continue'],
            ['101', 'Switching Protocols'],
            ['102', 'Processing'],
            ['103', 'Early Hints'],
            ['200', 'OK'],
            ['201', 'Created'],
            ['202', 'Accepted'],
            ['203', 'Non-Authoritative Information'],
            ['204', 'No Content'],
            ['205', 'Reset Content'],
            ['206', 'Partial Content'],
            ['default': 'No Code']
        ])
    const returnReasonPhraseCode = code => {
        console.log(reasonPhraseCode.get(code) || reasonPhraseCode.get('default'))
    }

```sh
    --- new Map()
        {(100, 'Continue'), (101, 'Switching Protocols'), (102, 'Processing'), (103, 'Early Hints')}

    --- Object
        {100: 'Continue', 101: 'Switching Protocols', 102: 'Processing', 103: 'Early Hints'}
```

## Nguyên tắc lập trình Solid trong lập trình

    [SOLID] là viết tắt của 5 chữ cái đầu trong 5 nguyên tác thiết kế hướng đối tượng
        - Single responsibility priciple (SRP)
            - Một class chỉ nên giữ 1 trách nhiệm duy nhất.

        - Open/Closed principle (OCP)
            - Có thể mở rộng một class nhưng không được phép sửa đổi bên trong class đó.
            - Theo nguyên lý Open/Close khi muốn thêm một chức năng cho chương trình -> nên viết class mới mở rộng class cũ bằng cách kế thừa class cũ không nên sửa đổi class cũ.

        - Liskov substitution principle (LSP)
            - Trong chương trình các Object của class con có thể thay thế class cha mà không làm thay đổi tính đúng đắn của chưng trình.

        - Interface segregation principle (ISP)
            - Thay vì dùng một interface lớn nên tách thành nhiều interface nhỏ với mục đích cụ thể

        - Dependency inversion principle (DIP)
            - Các module cấp cao không nên phụ thuộc vào các module cấp thấp.
              Cả hai nên phụ thuộc vào [abstraction]
            - Interface (abstraction) không nên phụ thuộc vào chi tiết mà ngược lại. (Các class giao tiếp với nhau thông qua interface không phải thông qua implementation)

# Signup

    - Sử dụng thuật toán bất đối xứng
    - Create privateKey và publicKey -> privateKey Sẽ được đưa cho người dùng(Không lưu vào trong hệ thống) -> publicKey sẽ được lưu vào hệ thông
        - PrivateKey dùng để sign token
        - PublicKey dùng để verify token
    - Sử dụng [crypto.generateKeyPairSync(type[, options])]: là một phương thức được sử dụng để đồng bộ tạo cặp khóa bất đối xứng (asymmetric key pair). Nó tạo ra cặp khóa bao gồm private key và public key cho việc sử dụng thuật toán mã hóa bất đối xứng.
    - [crypto.generateKeyPairSync(type[, options])]: [https://nodejs.org/api/crypto.html#cryptogeneratekeypairsynctype-options]
        - Type: là kiểu thuật toán mã hóa bất đối xứng (rsa, dsa, ec)
        - option: là một Object tùy chọn chỉ định thông số cho quá trình tạo khóa

```sh
const { generateKeyPairSync } = await import('node:crypto');

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'pkcs1',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
});
```

# Lưa lại userid, publickey và refesh token

    Tạo createKeyToken lưu userId, publicKey và refreshToken -> lấy publicKey đã lưu trong db và privateKey để tạo cặp access token và refresh token

# Viết middleware check apikey và permissions

    - Là quy trình xử lý HTTP của một ứng dụng Web

# Xử lý ErrorHandler trong API

    - Handler 404
    - Viết asyncHandler middleware trong express sử dụng để xử lý bất đồng bộ trong router handlers thay thế cho [try-catch]

# Make your api response use class

    - Create file error.response.js và success.response.js

# Login shop api

    - Làm rõ các khái niệm token, access token, refresh token
    1. Check emali in dbs
    2. Match password
    3. Create AT vs RT and save
    4. Generate tokens
    5. Get data return login

# Logout api

    - Viết fuc check Authentication (src\auth\authUtils.js)

# Xử lý token được sử dụng trái phép và cách xử lý

# Event loop là gì?

    - Cơ chế vòng lặp sự kiện và công việc được đưa vào hàng đợi và xử lý theo trình tự trong môi trường JS và browser

![Alt text](image-2.png)

# Tại sao Js là ngôn ngữ đơn luồng?

# V8? và vai trò

# Heap và Stack

## macro task(task queue) và micro task(job queue)

- Cơ chế hoạt động
  ![Alt text](/eventloop/image.png)
  ```sh
    - macro-task('task queue') và micro-task(job queue): quyết định độ ưu tiên của các tác vụ trong eventloop.
    - macro-task('task queue'): bao gồm setTimeout, setInterval, setImmediate, I/O, Ui render,...
    - micro-task(job queue): bao gồm promise, process.nextTick, async/await,...
    - Cơ chế hoạt động:
        micro-task sẽ được thực hiện trước macro-task mặc dù macro-task được đưa vào hàng đợi trước.
        macro-task sẽ được thực thi sau khi các micro-task được thực thi.
  ```
  ![Alt text](/eventloop/image-1.png)

# Kiến trúc lược đồ cho product (Schema Product Ecommerce)

    - Polymorphic pattern

![Alt text](/eventloop/polymorphic.png)
![Alt text](/eventloop//polymorphic-1.png)
![Alt text](/eventloop//polymorphic-2.png)
![Alt text](/eventloop//polymorphic-3.png)

# Factory Pattern

    - Simple Factory Pattern
    - Factory Method Pattern
    - Abstract Factory Pattern

# Post, Put And Patch
