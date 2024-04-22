const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');
const authMiddleware = require('../app/middlewares/authMiddleware');

// Home
router.get('/' ,
    authMiddleware.protect, 
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    siteController.index
);

module.exports = router;
