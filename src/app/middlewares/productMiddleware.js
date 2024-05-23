// middlewares

const CategoriesProduct = require('../models/CategoriesProduct-model');
exports.checkCategories =  (req, res, next) => {
    const name = req.body.name;
    CategoriesProduct.findOne({ name })
        .then( category => {
            if(category){
                res.status(400).json({
                    error: 'Tên danh mục đã tồn tại'
                })
            }else{
                next();
            }
        })
}