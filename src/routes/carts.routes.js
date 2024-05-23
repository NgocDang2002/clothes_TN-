const express = require('express');
const router = express.Router();
const cartsController = require('../app/controllers/CartsController');

const authMiddleware = require('../app/middlewares/authMiddleware');
const cartsMiddleware = require('../app/middlewares/cartsMiddleware');


// sủa đổi sản phầm trong giỏ hàng
router.patch('/:id',
    authMiddleware.protect, 
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    // cartsMiddleware.updateQuantity,
    cartsController.updateProductCart);



router.get('/statistical',
    authMiddleware.protect, 
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    cartsMiddleware.getOrderInfoAdmin,
    cartsController.statistical);



router.get('/bill',
    authMiddleware.protect, 
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    cartsMiddleware.getOrderInfoAdmin,
    cartsController.bill);

    
router.get('/billuser',
    authMiddleware.protect, 
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    cartsMiddleware.getOrderInfo,
    cartsController.billUser);


router.get('/:slug',
    authMiddleware.protect, 
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    cartsMiddleware.productInformationSlug,
    cartsController.orderInformation);



router.post('/handle-form-cartpayproduct',
    authMiddleware.protect, 
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    cartsMiddleware.OrderLinkProcessing,
    cartsController.handleFormCartpayproduct
);


// Định tuyến cho trang giỏ hàng và xử lý yêu cầu POST
router.post('/cartpayproduct', 
    authMiddleware.protect, 
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    // cartsMiddleware.compareCart,
    cartsMiddleware.informationOrder,
    cartsController.cartpayproduct
);

// thêm sản phẩm vào giỏ hàng
router.post('/:id',
    authMiddleware.protect, 
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    cartsMiddleware.handleProductLink,
    cartsController.cartsAdd 
);


router.get('/',
    authMiddleware.protect, 
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    cartsMiddleware.compareCart,
    cartsMiddleware.ProductInformation,  
    cartsController.index);

module.exports = router;