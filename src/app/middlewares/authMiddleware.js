// middlewares/authMiddleware.js
const User = require('../models/User-models');


// xác thực người dùng
exports.isAuthenticated = (req, res, next) => {
    if (req.body.username && req.body.password) {
        const { username, password } = req.body;
        User.findOne({ username, password })
            .then(user => {
                if (!user) {
                    res.status(401).send('Tên đăng nhập hoặc mật khẩu không chính xác!');
                } else {
                    req.session.isAuthenticated = true; // Đăng nhập thành công
                    req.session.userId = user._id;
                    next();
                }
            })
            .catch(err => {
                res.status(500).send('Lỗi xác thực người dùng!');
            });
    } else {
        // Nếu không có thông tin đăng nhập, đặt isAuthenticated thành false
        req.session.isAuthenticated = false;
        res.status(401).send('Bạn chưa đăng nhập!');
    }
};

// lưu trữ thông tin người dùng đăng nhập
exports.protect = (req, res, next) => {
    if (req.session.isAuthenticated) {
        const userId = req.session.userId;
        User.findById(userId).exec()
            .then(user => {
                if (!user) {
                    // Không tìm thấy người dùng, chuyển tiếp cho middleware/route khác
                    req.session.isAuthenticated = false;
                    res.status(401).send('Bạn chưa đăng nhập!');
                    next();
                } else {
                    req.user = user;
                    next();
                }
            })
            .catch(err => {
                res.status(500).send('Lỗi xác thực người dùng!');
            });
    } else {
        // res.status(500).send('Lỗi');
        next();
    }
};


// lấy ra thông tin người dùng khi đăng nhập
exports.authenticateUser = (req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated;
    if (isAuthenticated) {
        const userId = req.session.userId;
        User.findById(userId)
            .then(user => {
                if (!user) {
                    throw new Error('Không tìm thấy người dùng!');
                }
                // Kiểm tra xem người dùng có vai trò là admin không
                if (user.role === 'admin') {
                    // Nếu là admin, trả về một giá trị nào đó
                    res.locals.isAdmin = true;
                } else {
                    // Nếu không phải là admin, trả về một giá trị khác
                    res.locals.isAdmin = false;
                }
                req.user = user;
                res.locals.isAuthenticated = true; // Truyền trạng thái xác thực vào res.locals
                res.locals.user = user; // Truyền thông tin người dùng vào res.locals
                next();
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ message: error.message });
            });
    } else {
        res.locals.isAuthenticated = false; // Đặt trạng thái xác thực thành false
        next(); // Tiếp tục chuyển tiếp nếu không xác thực
    }
}; 


// sủ lý đăng xuất
exports.redirectMiddleware = (req, res, next) => {
    // Kiểm tra nếu yêu cầu là phương thức POST và đến từ đường dẫn "/logoutUser" hoặc "admin/logoutUser"
    if (req.method === 'POST' && (req.originalUrl.endsWith('/logoutUser') || req.originalUrl.endsWith('/admin/logoutUser'))) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).send("Internal Server Error");
            }
            // Kiểm tra xem req.session có tồn tại không trước khi thiết lập thuộc tính
            if (req.session) {
                // Xóa thông tin người dùng khỏi phiên
                delete req.session.user;
                // Đặt trạng thái xác thực thành false nếu session tồn tại
                req.session.isAuthenticated = false;
            }
            next();
        });
    } else if (req.method === 'GET' && req.originalUrl === '/products/logoutUser') {
        // Nếu yêu cầu đến từ '/products/logoutUser' và là phương thức GET, thực hiện chuyển hướng đến '/logoutUser'
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).send("Internal Server Error");
            }
            // Kiểm tra xem req.session có tồn tại không trước khi thiết lập thuộc tính
            if (req.session) {
                // Xóa thông tin người dùng khỏi phiên
                delete req.session.user;
                // Đặt trạng thái xác thực thành false nếu session tồn tại
                req.session.isAuthenticated = false;
            }
            // Chuyển hướng về '/logoutUser'
            res.redirect('/logoutUser');
        });
    } else {
        next();
    }
};



