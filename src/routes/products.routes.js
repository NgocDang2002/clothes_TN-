const express = require('express');
const router = express.Router();
const upload = require('../util/filemulter');

const productsController = require('../app/controllers/ProductsController');

const authMiddleware = require('../app/middlewares/authMiddleware');


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
router.delete('/:id',
    productsController.delete
);
router.delete('/:id/force', 
    productsController.forceDestroy
);

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
