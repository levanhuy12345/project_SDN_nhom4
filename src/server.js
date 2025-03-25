const express = require('express');
const app = express();
const route = require('./routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./Config/db');
const path = require('path');
const bodyParser = require('body-parser');

require('dotenv').config();

const port = 5001;

const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.REACT_APP_URL,
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true,
    },
});

app.use(cookieParser());
app.use(cors({ origin: process.env.REACT_APP_URL, credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '')));

route(app);
connectDB();

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendMessage', (message) => {
        io.emit('message', message);

        if (message.toLowerCase() === 'chào bạn') {
            setTimeout(() => {
                io.emit('message', 'Xin chào bạn , tôi có thể giúp gì cho bạn ?');
            }, 1000);
        } else if (message.toLowerCase() === 'bạn giới thiệu về website đi') {
            setTimeout(() => {
                io.emit(
                    'message',
                    'Peak Sport Vietnam là một trong những nền tảng mua sắm trực tuyến hàng đầu tại Việt Nam với sứ mệnh mang đến cho khách hàng những sản phẩm chất lượng cao về thể thao và phong cách sống. Với sự đa dạng và phong phú trong danh mục sản phẩm, Peak Sport Vietnam cung cấp những lựa chọn đa dạng từ giày dép, quần áo, phụ kiện đến dụng cụ thể thao và các sản phẩm phong cách hàng ngày.',
                );
            }, 1000);
        } else if (message.toLowerCase() === 'chuỗi cửa hàng của mình ở đâu') {
            setTimeout(() => {
                io.emit(
                    'message',
                    '1.PEAK STORE CẦN THƠ 1/47 Đinh Tiên Hoàng, Ninh Kiều, Cần Thơ , 2. PEAK STORE – TRẦN ĐĂNG NINH HNSố 131, Trần Đăng Ninh, phường Dịch Vọng, quận Cầu Giấy, Hà Nội , 3. PEAK STORE – ĐẠI CỒ VIỆTSố 79, Đại Cồ Việt, phường Bách Khoa, quận Hai Bà Trưng, Hà Nội',
                );
            }, 1000);
        } else if (message.toLowerCase() === 'bạn giới thiệu về mình đi') {
            setTimeout(() => {
                io.emit(
                    'message',
                    'tôi là một chatbot tự động được tạo ra từ socket.io, thư viện mạnh mẽ về thời gian thực và tôi ở đây để hỗ trợ bạn khi nào bạn cần, chúng ta cùng trò chuyện nhé !!!',
                );
            }, 1000);
        } else {
            setTimeout(() => {
                io.emit('message', 'tôi chưa hiểu ý bạn lắm !!!');
            }, 1000);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    // Sử dụng server.listen thay vì app.listen
    console.log(`Example app listening on port ${port}`);
});
