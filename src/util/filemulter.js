const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục đích nếu nó không tồn tại
const uploadDir = path.join(__dirname, '../public', 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  });
 
module.exports = multer({ storage: storage });