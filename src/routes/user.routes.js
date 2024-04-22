const express = require('express');
const router = express.Router(); 

const userController = require('../app/controllers/UserController');
const upload = require('../util/filemulter');
const authMiddleware = require('../app/middlewares/authMiddleware');


router.get('/login', 
    userController.login
);
router.post('/loginUser', 
    authMiddleware.isAuthenticated,
    userController.loginUser
);
// Route GET để hiển thị trang đăng xuất
router.get('/logoutUser',
    userController.logoutUser
);
// // Route POST để xử lý việc đăng xuất
router.post('/logoutUser', 
    authMiddleware.redirectMiddleware ,
        userController.logoutUser
);
router.post('/position',
    upload.single('avatar'), 
    userController.position
);
router.get('/register',
    userController.register
);
router.get('/user',
    authMiddleware.protect, 
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    userController.index
);
// router.post('/handle-form-actions',userController.handleFormActions);




module.exports = router;
