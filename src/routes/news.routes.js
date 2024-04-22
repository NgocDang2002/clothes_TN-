const express = require('express');
const router = express.Router();

const newsController = require('../app/controllers/NewsController');
const authMiddleware = require('../app/middlewares/authMiddleware');



router.get('/:slug',
    authMiddleware.protect , 
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    newsController.show
);
//news
router.get('/',
    authMiddleware.protect, 
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    newsController.index
);


module.exports = router;
