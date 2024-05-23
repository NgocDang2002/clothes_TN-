const Products = require('../models/Products-models');
const CategoriesProduct = require('../models/CategoriesProduct-model');
const SizeProduct = require('../models/SizeProduct-model');
const ColorProduct = require('../models/ColorProduct-model');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');

class ProductsController {

    // [GET] / products
    index(req, res, next) {
        Products.find({})
            .then(product => {
                res.render('products', {
                    product: mutipleMongooseToObject(product),
                    isAuthenticated: res.locals.isAuthenticated,
                    isAdmin: res.locals.isAdmin, // Truyền giá trị isAdmin vào template
                    user: mongooseToObject(res.locals.user),
                });
                // res.send(product)
            })
            .catch(next);
        // return res.render('products');
    }

    // [GET] / products/:slug
    information(req, res, next) {
        Products.findOne({ slug: req.params.slug })
            .then((product) => {
                if (!product) {
                    return res.status(404).send('Product not found.');
                }
    
                res.render('products/information', {
                    product: mongooseToObject(product),
                    sizes: product.sizes, // Truyền các sizes vào template
                    colors: product.colors, // Truyền các sizes vào template
                    isAuthenticated: res.locals.isAuthenticated,
                    isAdmin: res.locals.isAdmin, // Truyền giá trị isAdmin vào template
                    user: mongooseToObject(res.locals.user),
                });
            })
            .catch(next);
    }
    
    // ----------------------------------------------------------------

    // ADMIN
    // [GET] / products/create
    create(req, res, next) {
        // Lấy tất cả thông tin của CategoriesProduct và SizeProduct từ cơ sở dữ liệu
        Promise.all([
            CategoriesProduct.find({}),
            SizeProduct.find({}),
            ColorProduct.find({})
        ])
        .then(([categories, sizes , colors]) => {
            // Chuyển đổi mảng categories và sizes thành đối tượng JSON
            const categoriesJSON = categories.map(category => mongooseToObject(category));
            const sizesJSON = sizes.map(size => mongooseToObject(size));
            const colorsJSON = colors.map(color => mongooseToObject(color));
            
            // Render trang 'products/create' và truyền dữ liệu vào template
            res.render('products/create', {
                isAuthenticated: res.locals.isAuthenticated,
                isAdmin: res.locals.isAdmin,
                user: mongooseToObject(req.user),
                categories: categoriesJSON, // Truyền mảng các đối tượng CategoriesProduct vào template
                sizes: sizesJSON, // Truyền mảng các đối tượng SizeProduct vào template
                colors: colorsJSON // Truyền mảng các đối tượng SizeProduct vào template
            });
        })
        .catch(error => {
            console.error('Lỗi khi lấy thông tin CategoriesProduct và SizeProduct:', error);
            // Xử lý lỗi nếu cần thiết
            next(error); // Chuyển lỗi tới middleware xử lý lỗi tiếp theo
        });
    }

    // // [POST] / products/store
    store(req, res, next) {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        } else {
            const selectedSizes = req.body.sizes; // Lấy các giá trị của checkbox
            const selectedColers = req.body.colors; // Lấy các giá trị của checkbox
    
            const product = new Products({
                name: req.body.name,
                description: req.body.description,
                image: '/uploads/' + req.file.filename,
                price: req.body.price,
                color: req.body.color,
                categories: req.body.categories,
                quantity: req.body.quantity,
                sizes: selectedSizes, // Lưu các size đã chọn vào MongoDB
                colors: selectedColers, // Lưu các size đã chọn vào MongoDB
            });
    
            product.save()
                .then(() => {
                    res.redirect('stored');
                })
                .catch((err) => {
                    console.error(err);
                    res.status(500).send('Error uploading file and creating product.');
                });
        }
    }
    
    
    


    // [GET] / products/:id/edit
    edit(req, res, next) {
        Products.findById(req.params.id)
            .then(product => res.render('products/edit', {
                product: mongooseToObject(product),
                isAuthenticated: res.locals.isAuthenticated,
                isAdmin: res.locals.isAdmin, // Truyền giá trị isAdmin vào template
                user: mongooseToObject(req.user),
            }))
            .catch(next);
    }
    // [Put] / products/:id
    update(req, res, next) {
        Products.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.render('products/stored', {
                isAuthenticated: res.locals.isAuthenticated,
                isAdmin: res.locals.isAdmin, // Truyền giá trị isAdmin vào template
                user: mongooseToObject(req.user),
            }))
            .catch(next);
        // res.json(req.body);
    }
    // [Delete] /products/:id
    delete(req, res, next) {
        Products.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    // [Delete] /products/:id/force
    forceDestroy(req, res, next) {
        Products.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }


    // [PATCH] /products/:id/restore
    restore(req, res, next) {
        Products.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);

    }
    // [POST] /products/handle-form-actions
    handleFormActions(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                Products.delete({ _id: { $in: req.body.productIds } })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({ message: 'Action is invalid' });
        }
    }


    // admin
    // hiển thị danh sách sản phẩm
    // [GET] /admin/stored/products
    storedProducts(req, res, next) {

        let productsQuery = Products.find({});

        if (req.query.hasOwnProperty('_sort')) {
            productsQuery = productsQuery.sort({
                [req.query.column]: req.query.type,
            });
            // res.json({message: "message"});
        }
        Promise.all([productsQuery, Products.countDocumentsDeleted()])
            .then(([products, deleteCount]) => res.render('products/stored', {
                deleteCount,
                products: mutipleMongooseToObject(products),
                isAuthenticated: res.locals.isAuthenticated,
                isAdmin: res.locals.isAdmin, // Truyền giá trị isAdmin vào template
                user: mongooseToObject(req.user),
            })
            )
            .catch(next);
    }

    // [GET] /admin/trash/products
    trashProducts(req, res, next) {
        Products.findDeleted({ deleted: { $exists: true } })
            .then(product => res.render('products/trash', {
                product: mutipleMongooseToObject(product),
                isAuthenticated: res.locals.isAuthenticated,
                isAdmin: res.locals.isAdmin, // Truyền giá trị isAdmin vào template
                user: mongooseToObject(req.user),
            }))
            .catch(next);

    }
    // Thêm loại sản phẩm
    // [GET] /admin/products/categories
    categories(req, res, next){
        res.render('products/categories', {
            isAuthenticated: res.locals.isAuthenticated,
            isAdmin: res.locals.isAdmin, // Truyền giá trị isAdmin vào template
            user: mongooseToObject(req.user),
        });
    }
    // [POST] /products/categori
    categori(req, res, next) { 
        // // Tạo một đối tượng CategoriesProduct mới với trường name
        const categori = new CategoriesProduct({
            name: req.body.name,
        });
    
        // Lưu đối tượng CategoriesProduct vào cơ sở dữ liệu
        categori.save()
            .then(() => {
                res.redirect('stored')
            })
            .catch(next);
    }
    
        // Thêm size sản phẩm
    // [GET] /admin/products/sizes
    sizes(req, res, next){
        res.render('products/sizes', {
            isAuthenticated: res.locals.isAuthenticated,
            isAdmin: res.locals.isAdmin, // Truyền giá trị isAdmin vào template
            user: mongooseToObject(req.user),
        });
    }
    
    // [POST] /admin/products/size
    size(req, res, next) { 
        const size = new SizeProduct({
            name: req.body.name,
        });
        size.save()
            .then(() => {
                res.redirect('stored')
            })
            .catch(next);
    }


    // Thêm màu cho sản phẩm sản phẩm
    // [GET] /admin/products/colors
    colors(req, res, next){
        res.render('products/colors', {
            isAuthenticated: res.locals.isAuthenticated,
            isAdmin: res.locals.isAdmin, // Truyền giá trị isAdmin vào template
            user: mongooseToObject(req.user),
        });
    }
    
    // [POST] /admin/products/color
    color(req, res, next) { 
        const color = new ColorProduct({
            name: req.body.name,
        });
        color.save()
            .then(() => {
                res.redirect('stored')
            })
            .catch(next);
    }
}
module.exports = new ProductsController();
