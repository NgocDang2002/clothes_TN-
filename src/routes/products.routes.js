const express = require('express');
const router = express.Router();
const upload = require('../util/filemulter');

const productsController = require('../app/controllers/ProductsController');

const authMiddleware = require('../app/middlewares/authMiddleware');
const productMiddleware = require('../app/middlewares/productMiddleware');


router.get('/create',
    authMiddleware.protect, 
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware, 
    productsController.create,
);
router.post('/store',
    authMiddleware.protect, 
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    upload.single('image') ,
    productsController.store
);


// ADMIN
router.get('/stored',
    authMiddleware.protect, 
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    productsController.storedProducts
);
router.get('/trash',
    authMiddleware.protect, 
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware, 
    productsController.trashProducts
);

router.post('/handle-form-actions',
    authMiddleware.protect,
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    productsController.handleFormActions
);
// sửa sản phẩm 
router.get('/:id/edit',
    authMiddleware.protect, 
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware, 
    productsController.edit
);

router.put('/:id',
    authMiddleware.protect, 
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    productsController.update
);

router.patch('/:id/restore',
    authMiddleware.protect, 
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    productsController.restore
);

// xóa sản phẩm vào thùng rác
router.delete('/:id',
    authMiddleware.protect,
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    productsController.delete
);

// xóa sản phẩm
router.delete('/:id/force',
    authMiddleware.protect,
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    productsController.forceDestroy
);

// Thêm loại sản phẩm 
router.get('/categories',
    authMiddleware.protect,
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware, 
    productsController.categories
);
router.post('/categori',
    authMiddleware.protect,
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    productMiddleware.checkCategories, 
    productsController.categori
);


// Thêm size sản phẩm 
router.get('/sizes',
    authMiddleware.protect,
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware, 
    productsController.sizes
);
router.post('/size',
    authMiddleware.protect,
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    productMiddleware.checkCategories, 
    productsController.size
);

// Thêm colors sản phẩm 
router.get('/colors',
    authMiddleware.protect,
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware, 
    productsController.colors
);
router.post('/color',
    authMiddleware.protect,
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    productMiddleware.checkCategories, 
    productsController.color
);

// -------------------------------------------------------
// user
router.get('/:slug',
    authMiddleware.protect, 
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    productsController.information
);
router.get('/', 
    authMiddleware.protect,
    authMiddleware.authenticateUser,
    authMiddleware.redirectMiddleware,
    productsController.index
);

module.exports = router;
