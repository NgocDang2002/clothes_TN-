const Products = require('../models/Products-models');
const Carts = require('../models/Carts-model');
const User =  require('../models/User-models');
const OrderListUser = require('../models/OrderListUser-model');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');


class CartsController {

    // [Get] /carts/
    index(req, res, next) {
        // Lấy dữ liệu từ res.locals
        const CartWithProducts = res.locals.CartWithProducts;
    
        // Rendere template 'carts' với dữ liệu đã lấy được
        res.render('carts', {
            isAuthenticated: res.locals.isAuthenticated,
            isAdmin: res.locals.isAdmin,
            user: mongooseToObject(res.locals.user),
            // Truyền dữ liệu CartWithProducts vào template
            carts: CartWithProducts
        });
    }
    
    
    // [Post] /carts/:id
    // Trả về trang giỏ hàng
    cartsAdd(req, res, next) {
        const absoluteURL = req.absoluteURL;
        const queryParams = new URLSearchParams({
            isAuthenticated: res.locals.isAuthenticated,
            isAdmin: res.locals.isAdmin,
            user: mongooseToObject(res.locals.user),
        }).toString();
        res.redirect(absoluteURL + '?' + queryParams);
    }



    // [Get] /carts/cartpayproduct
    // cartpayproduct (req, res, next){
    //     const productInfo = req.productInfo;
    //     const productsArray = [];
    //     productInfo.forEach(CartProducts => {
    //         Products.findById(CartProducts.productid)
    //             .then(products => {
    //                 if (!products) {
    //                     res.status(404).send("Không tìm thấy sản phẩm trong cơ sở dữ liệu");
    //                 }
    //                 else{
    //                     productsArray.push(products);
    //                 }
    //                 // Kiểm tra xem đã duyệt qua tất cả các sản phẩm chưa
    //                 if (productsArray.length === productInfo.length) {
    //                     // Nếu đã duyệt hết, gửi toàn bộ mảng sản phẩm về client
    //                     // res.json(productsArray);
    //                     res.render('carts/cartpayproduct', {
    //                         isAuthenticated: res.locals.isAuthenticated,
    //                         isAdmin: res.locals.isAdmin,
    //                         user: mongooseToObject(res.locals.user),
    //                         products: mutipleMongooseToObject(productsArray),
    //                     })
    //                 }
    //             })
    //             .catch(next);
    //     });
    // }

   // [Post] /carts/cartpayproduct
   cartpayproduct (req, res, next) {
    const cart = res.locals.cartWithProducts;
    // Kiểm tra nếu selectedProductIds không phải là mảng thì chuyển nó thành mảng
    // res.json(cart);
    res.render('carts/cartpayproduct', {
        isAuthenticated: res.locals.isAuthenticated,
        isAdmin: res.locals.isAdmin,
        user: mongooseToObject(res.locals.user),
        carts: cart,
    });
}


    // [POST] /carts/handle-form-cartpayproduct
    handleFormCartpayproduct(req, res, next){
        isAuthenticated: res.locals.isAuthenticated;
        isAdmin: res.locals.isAdmin;
        user: mongooseToObject(res.locals.user);

        // Chuyển hướng đến trang "billUser"
        res.redirect('billUser');
    }


    // [Get] /carts/billUser
    billUser(req, res, next) {
        const orders = req.orderListUsers;
        // res.json(orders);
        res.render('carts/billUser', {
            isAuthenticated: res.locals.isAuthenticated,
            isAdmin: res.locals.isAdmin,
            user: mongooseToObject(res.locals.user),
            orders : orders,
        });
    }



    // [Get] /carts/slug:
    orderInformation(req, res, next) {
        const order = req.order;
        // res.json(order);

        res.render('carts/StopBillProduct', {
            isAuthenticated: res.locals.isAuthenticated,
            isAdmin: res.locals.isAdmin,
            user: mongooseToObject(res.locals.user),
            order: order,
        });
    }



    // [Get] /carts/bill
    bill(req, res, next){
        const ordersAll = req.orderListAll;
        res.render('carts/billUser', {
            isAuthenticated: res.locals.isAuthenticated,
            isAdmin: res.locals.isAdmin,
            user: mongooseToObject(res.locals.user),
            orders : ordersAll,
        });
    }
    
    // [Get] /carts/statistical
    statistical(req, res, next){
        const ordersAll = res.locals.orderListUsersWithProductsAll;
        const ordersAllJson = JSON.stringify(ordersAll);
        res.render('carts/statistical', {
            isAuthenticated: res.locals.isAuthenticated,
            isAdmin: res.locals.isAdmin,
            user: mongooseToObject(res.locals.user),
            ordersAllJson: ordersAllJson,
        });
    }
    // [PATCH] /carts/:id
    // updateProductCart(req, res, next){
    //     Carts.updateOne(
    //         {_id: req.params.id}, 
    //         {
    //             totalmoney: req.body.newTotalMoney,
    //             quantity: req.body.newQuantity,
    //             size: req.body.productSize,
    //             color: req.body.productColor
    //         }
    //     )
    //         .then(() => {
    //             const queryParams = new URLSearchParams({
    //                 isAuthenticated: res.locals.isAuthenticated,
    //                 isAdmin: res.locals.isAdmin, // Truyền giá trị isAdmin vào template
    //                 user: JSON.stringify(mongooseToObject(res.locals.user))
    //             }).toString();
    //             res.redirect('/carts'); // Chuyển hướng đến URL '/carts'
    //         })
    //         .catch(next);
    // }
    updateProductCart(req, res, next) {
        const cartId = req.params.id;
        // Kiểm tra xem cartId có giá trị hợp lệ không
        if (!cartId || cartId === "null") {
            return res.status(400).json({ error: 'Invalid cart ID' });
        }
    
        const { newTotalMoney, newQuantity, productSize, productColor } = req.body;
        Carts.updateOne(
            { _id: cartId }, 
            {
                totalmoney: newTotalMoney,
                quantity: newQuantity,
                size: productSize,
                color: productColor
            }
        )
        .then(() => {
            const queryParams = new URLSearchParams({
                isAuthenticated: res.locals.isAuthenticated,
                isAdmin: res.locals.isAdmin,
                user: JSON.stringify(mongooseToObject(res.locals.user))
            }).toString();
            res.redirect('/carts');
        })
        .catch(next);
    }
    
    
    
}

module.exports = new CartsController();
