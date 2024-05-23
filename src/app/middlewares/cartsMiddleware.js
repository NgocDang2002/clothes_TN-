const User = require('../models/User-models');
const Products = require('../models/Products-models');
const OrderListUser = require('../models/OrderListUser-model');
const Carts = require('../models/Carts-model');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const mongoose = require('mongoose');
const { request, response } = require('express');


// thêm sản phẩm vào giỏ hàng
// Xử lý yêu cầu thêm sản phẩm vào giỏ hàng
exports.handleProductLink = (req, res, next) => {
    const { id } = req.params;

    const { price, quantity, size, totalmoney, color } = req.body;

    const carts = new Carts({
        userid: req.user.id,
        productid: id,
        quantity,
        size,
        totalmoney,
        color
    });

    carts.save()
        .then(() => {
            // Chuyển hướng đến trang giỏ hàng
            res.redirect('/carts');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Lỗi khi lưu sản phẩm vào giỏ hàng.');
        });
}

// chuyển đổi thông tin của đơn hàng
exports.informationOrder = (req, res, next) => {
    let selectedProductIds = req.body.selectedProducts;

    if (!Array.isArray(selectedProductIds)) {
        selectedProductIds = [selectedProductIds];
    }

    Carts.find({ _id: selectedProductIds })
        .then(carts => {
            if (!carts || carts.length === 0) {
                return res.status(404).send("Không tìm thấy đơn hàng.");
            }

            // Lấy ra tất cả các productid từ Carts
            const productIds = carts.reduce((ids, cart) => {
                return ids.concat(cart.productid); // productid thay vì productsid
            }, []);

            // Tìm tất cả các sản phẩm có trong danh sách productIds
            Products.find({ _id: { $in: productIds } })
                .then(products => {
                    if (!products || products.length === 0) {
                        return res.status(404).send("Không tìm thấy sản phẩm.");
                    }

                    // Thay thế productid bằng thông tin chi tiết của sản phẩm tìm thấy
                    const cartWithProducts = carts.map(cart => {
                        const product = products.find(p => p._id.toString() === cart.productid.toString());
                        const cartProduct = product ? product : { _id: cart.productid, name: "Unknown Product" };
                        return { ...cart.toObject(), productid: [cartProduct] };
                    });
                    res.locals.cartWithProducts = cartWithProducts;
                    // res.json(res.locals.cartWithProducts);
                    next();
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send("Đã xảy ra lỗi khi tìm sản phẩm.");
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Đã xảy ra lỗi khi tìm đơn hàng.");
        });
};





// so sánh và lấy giá trị từng sản phẩm
exports.compareCart = (req, res, next) => {
    // Kiểm tra nếu req.user không tồn tại hoặc không có thuộc tính id
    if (!req.user || !req.user.id) {
        // Điều hướng hoặc xử lý tùy thuộc vào yêu cầu của bạn khi không có người dùng đăng nhập
        return res.render('admin/login');
    }
    // Tìm giỏ hàng của người dùng dựa trên userid
    Carts.find({userid: req.user.id })
        .then(userCart => {
            if (!userCart) {
                // Nếu không tìm thấy giỏ hàng của người dùng, trả về lỗi
                return res.status(404).send("Không tìm thấy giỏ hàng của người dùng");
            }
            // res.json(userCart);
            // Truyền thông tin sản phẩm qua biến req
            req.CartUsers = userCart;
            next();

        })
        .catch(err => {
            // Xử lý lỗi nếu có
            console.error(err);
            res.status(500).send("Đã xảy ra lỗi khi so sánh giỏ hàng và sản phẩm");
        });
};

// Lấy thông tin sản phẩm từ giỏ hàng
exports.ProductInformation = (req, res, next) => {
    const CartUsers = req.CartUsers;

    // Lấy ra tất cả các productid từ Cart
    const productIds = CartUsers.map(order => order.productid);

    // Tìm tất cả các sản phẩm có trong danh sách productIds
    Products.find({ _id: { $in: productIds } })
        .then(products => {
            if (!products || products.length === 0) {
                return res.status(404).send("Không tìm thấy sản phẩm.");
            }

            // Tạo một bản đồ (map) từ productId tới sản phẩm
            const productMap = products.reduce((map, product) => {
                map[product._id.toString()] = product;
                return map;
            }, {});

            // Thay thế productid bằng thông tin chi tiết của các sản phẩm tìm thấy
            const CartWithProducts = CartUsers.map(cartUser => {
                const product = productMap[cartUser.productid.toString()];
                const cartProduct = product ? { ...product.toObject(), quantity: cartUser.quantity } : null; // Nếu không tìm thấy sản phẩm, thì trả về null
                return { ...cartUser.toObject(), productid: cartProduct };
            });

            // Đặt dữ liệu đã xử lý vào res.locals hoặc req để sử dụng trong middleware tiếp theo
            res.locals.CartWithProducts = CartWithProducts;

            // Trả về kết quả
            // res.json(CartWithProducts);

            next();
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Đã xảy ra lỗi khi tìm sản phẩm.");
        });
};




// Thêm sản phầm từ bên giỏ hàng qua đơn hàng

// code tạm ổn
// exports.OrderLinkProcessing = (req, res, next) => {
//     const userId = req.user.id;
//     const userName = req.user.name;
//     const userPhone = req.user.phone;
//     const userAddress = req.user.address;
//     const userEmail = req.user.email;
//     const totalOrder = req.body.totalMoney;  // Nhận giá trị totalMoney từ form
//     const orderNote = req.body.orderNote;

//     // Lấy các chi tiết sản phẩm từ form
//     const productIds = req.body.productId;
//     const quantities = req.body.quantity;
//     const sizes = req.body.size;
//     const colors = req.body.color;

  
//     const orderDetails = [];

//     productIds.forEach((productId, index) => {
//         if (productId !== "") {
//             if (Array.isArray(sizes)) {
//                 sizes.forEach((size, sizeIndex) => {
//                     const color = Array.isArray(colors) ? colors[sizeIndex] : colors;
//                     const quantity = Array.isArray(quantities) ? quantities[sizeIndex] : quantities;
    
//                     if (color && quantity) {
//                         const existingOrderIndex = orderDetails.findIndex(order => 
//                             order.productId === productId && 
//                             order.size === size && 
//                             order.color === color
//                         );
    
//                         if (existingOrderIndex !== -1) {
//                             orderDetails[existingOrderIndex].quantity += parseInt(quantity);
//                         } else {
//                             const newOrder = {
//                                 productId: productId,
//                                 quantity: parseInt(quantity),
//                                 size: size,
//                                 color: color,
//                             };
//                             orderDetails.push(newOrder);
//                         }
//                     }
//                 });
//             } else {
//                 const size = sizes;
//                 const color = colors;
//                 const quantity = quantities;
    
//                 if (color && quantity) {
//                     const existingOrderIndex = orderDetails.findIndex(order => 
//                         order.productId === productId && 
//                         order.size === size && 
//                         order.color === color
//                     );
    
//                     if (existingOrderIndex !== -1) {
//                         orderDetails[existingOrderIndex].quantity += parseInt(quantity);
//                     } else {
//                         const newOrder = {
//                             productId: productId,
//                             quantity: parseInt(quantity),
//                             size: size,
//                             color: color,
//                         };
//                         orderDetails.push(newOrder);
//                     }
//                 }
//             }
//         }
//     });
    
//     // res.json(orderDetails);
    

//     // Tạo đơn hàng mới với các thông tin chi tiết
//     const newOrder = new OrderListUser({
//         userid: userId,
//         username: userName,
//         useraddress: userAddress,
//         phoneuser: userPhone,
//         emailuser: userEmail,
//         productsid: orderDetails,
//         note: orderNote,
//         totalorder: totalOrder  // Lưu giá trị totalMoney vào trường totalorder
//     })
//         res.json(newOrder);
//     // Lưu đơn hàng vào MongoDB
//     // newOrder.save()
//     // .then(order => {
//     //     res.json(order);
//     //     // next();
//     // })
//     // .catch(err => {
//     //     console.error('Error creating order:', err);  // In chi tiết lỗi
//     //     res.status(500).send("Lỗi.");
//     // });
    

    
// };

// code ngon

// exports.OrderLinkProcessing = (req, res, next) => {
//     const userId = req.user.id;
//     const userName = req.user.name;
//     const userPhone = req.user.phone;
//     const userAddress = req.user.address;
//     const userEmail = req.user.email;
//     const totalOrder = req.body.totalMoney;  // Nhận giá trị totalMoney từ form
//     const orderNote = req.body.orderNote;

//     // Lấy các chi tiết sản phẩm từ form
//     const productIds = req.body.productId;
//     const quantities = req.body.quantity;
//     const sizes = req.body.size;
//     const colors = req.body.color;

//     // Tạo một mảng để lưu trữ thông tin chi tiết của các sản phẩm trong đơn hàng
//     const products = [];

//     // Lặp qua từng sản phẩm và tạo đối tượng để lưu vào mảng products
//     for (let i = 0; i < productIds.length; i++) {
//         const product = {
//             productId: productIds[i],
//             quantity: quantities[i],
//             size: sizes[i],
//             color: colors[i]
//         };
//         products.push(product);
//     }
//     // res.json(products);
//     // Tạo một đối tượng mới dựa trên model OrderListUser để lưu vào cơ sở dữ liệu
//     const newOrder = new OrderListUser({
//         userid: userId,
//         username: userName,
//         useraddress: userAddress,
//         phoneuser: userPhone,
//         emailuser: userEmail,
//         productsid: products,
//         totalorder: totalOrder,
//         note: orderNote
//     });

//     // Lưu đơn hàng vào cơ sở dữ liệu
//     newOrder.save()
//         .then(order => {
//             // // Đã lưu thành công, có thể thực hiện các hành động tiếp theo nếu cần
//             // res.status(201).json({ success: true, order: order });
//             // res.json(order);
//             next();
//         })
//         .catch(err => {
//             // Xử lý lỗi nếu không thể lưu đơn hàng
//             res.status(500).json({ success: false, error: err.message });
//         });
// };


exports.OrderLinkProcessing = (req, res, next) => {
    const userId = req.user.id;
    const userName = req.user.name;
    const userPhone = req.user.phone;
    const userAddress = req.user.address;
    const userEmail = req.user.email;
    const totalOrder = req.body.totalMoney;  // Nhận giá trị totalMoney từ form
    const orderNote = req.body.orderNote;

    // Lấy các chi tiết sản phẩm từ form
    const productIds = req.body.productId;
    const quantities = req.body.quantity;
    const sizes = req.body.size;
    const colors = req.body.color;
    let idCart = req.body.id;
    if (!Array.isArray(idCart)) {
        idCart = [idCart]; // Chuyển idCart thành mảng nếu nó không phải là mảng
    }

    // Tạo một mảng để lưu trữ thông tin chi tiết của các sản phẩm trong đơn hàng
    const products = [];

    // Lặp qua từng sản phẩm và tạo đối tượng để lưu vào mảng products
    
    if(!Array.isArray(productIds)){
        const product = {
            productId: productIds,
            quantity: quantities,
            size: sizes,
            color: colors
        };
        products.push(product);
    }
    else{
        for (let i = 0; i < productIds.length; i++) {
            const product = {
                productId: productIds[i],
                quantity: quantities[i],
                size: sizes[i],
                color: colors[i]
            };
            products.push(product);
        }
    }
    // Xóa sản phẩm khỏi giỏ hàng trong bảng Carts
    const deleteCartsPromises = idCart.map(() => {
        return Carts.findOneAndDelete({
            _id: idCart,
        });
    });
    Promise.all(deleteCartsPromises)
        .then(() => {
            // Cập nhật số lượng sản phẩm trong bảng Products
            const updateProductsPromises = products.map(product => {
                return Products.findOneAndUpdate(
                    {
                        _id: product.productId,
                        quantity: { $gte: product.quantity }, // Đảm bảo số lượng đủ để giảm

                    },
                    { $inc: { quantity: -product.quantity } }, // Giảm số lượng sản phẩm
                    { new: true }
                );
            });
            // return Promise.all(updateProductsPromises);
        })
        .then(updatedProducts => {
            // Tạo đơn hàng mới và lưu vào cơ sở dữ liệu
            const newOrder = new OrderListUser({
                userid: userId,
                username: userName,
                useraddress: userAddress,
                phoneuser: userPhone,
                emailuser: userEmail,
                productsid: products,
                totalorder: totalOrder,
                note: orderNote
            });
            res.json(products);
            // Thêm console.log để in ra thông tin trước khi lưu vào cơ sở dữ liệu
            // console.log("Order data before saving: ", newOrder);    
            // res.json(newOrder);

            return newOrder.save();
        })
        .then(() => {
            // Trả về kết quả thành công
            // res.status(201).json({ success: true, order: order });
            next();
            // res.json(order);
        })
        .catch(err => {
            // Xử lý lỗi
            res.status(500).json({ success: false, error: err.message });
        });

};








// Lấy ra đơn hàng có cúng user
// exports.getOrderInfo = (req, res, next) => {
//     OrderListUser.find({ userid: req.user.id })
//         .then(orderListUsers => {
//             if (!orderListUsers || orderListUsers.length === 0) {
//                 return res.status(404).send("Không tìm thấy đơn hàng.");
//             }

//             // Lấy ra tất cả các productid từ orderListUsers
//             const productIds = orderListUsers.reduce((ids, order) => {
//                 return ids.concat(order.productsid);
//             }, []);

//             // Tìm tất cả các sản phẩm có trong danh sách productIds
//             Products.find({ _id: { $in: productIds } })
//                 .then(products => {
//                     if (!products || products.length === 0) {
//                         return res.status(404).send("Không tìm thấy sản phẩm.");
//                     }

//                     // Thay thế productsid bằng thông tin chi tiết của các sản phẩm tìm thấy
//                     const orderListUsersWithProducts = orderListUsers.map(orderListUser => {
//                         const orderProducts = orderListUser.productsid.map(productId => {
//                             const product = products.find(p => p._id.toString() === productId.toString());
//                             return product ? product : { _id: productId, name: "Unknown Product" }; // Nếu không tìm thấy sản phẩm, thì trả về thông tin cơ bản
//                         });

//                         return { ...orderListUser.toObject(), productsid: orderProducts };
//                     });

//                     // res.json(orderListUsersWithProducts);
//                     // req.orderList = orderListUsersWithProducts;
//                     // // next();
//                     // // Thu thập dữ liệu cần gửi
//                     // const responseData = orderListUsersWithProducts.map(order => order.productsid);

//                     // // Gửi một phản hồi duy nhất
//                     // // res.json(responseData);
//                     // req.products = responseData;
//                     // next();
//                     res.locals.orderListUsersWithProducts = orderListUsersWithProducts;
//                     next();
//                 })
//                 .catch(err => {
//                     console.error(err);
//                     res.status(500).send("Đã xảy ra lỗi khi tìm sản phẩm.");
//                 });
//         })
//         .catch(err => {
//             console.error(err);
//             res.status(500).send("Đã xảy ra lỗi khi tìm đơn hàng.");
//         });
// };
exports.getOrderInfo = (req, res, next) => {
    OrderListUser.find({ userid: req.user.id })
        .then(orderListUsers => {
            if (!orderListUsers || orderListUsers.length === 0) {
                return res.status(404).send("Không tìm thấy đơn hàng.");
            }
            // res.json(orderListUsers);
            req.orderListUsers = orderListUsers;
            next();
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Đã xảy ra lỗi khi tìm đơn hàng.");
        });
};






// Lấy ra toàn bộ đơn hàng 
// exports.getOrderInfoAdmin = (req, res, next) => {
//     OrderListUser.find({})
//         .then(orderListUsers => {
//             if (!orderListUsers || orderListUsers.length === 0) {
//                 return res.status(404).send("Không tìm thấy đơn hàng.");
//             }

//             // Lấy ra tất cả các productid từ orderListUsers
//             const productIds = orderListUsers.reduce((ids, order) => {
//                 return ids.concat(order.productsid);
//             }, []);

//             // Tìm tất cả các sản phẩm có trong danh sách productIds
//             Products.find({ _id: { $in: productIds } })
//                 .then(products => {
//                     if (!products || products.length === 0) {
//                         return res.status(404).send("Không tìm thấy sản phẩm.");
//                     }

//                     // Thay thế productsid bằng thông tin chi tiết của các sản phẩm tìm thấy
//                     const orderListUsersWithProducts = orderListUsers.map(orderListUser => {
//                         const orderProducts = orderListUser.productsid.map(productId => {
//                             const product = products.find(p => p._id.toString() === productId.toString());
//                             return product ? product : { _id: productId, name: "Unknown Product" }; // Nếu không tìm thấy sản phẩm, thì trả về thông tin cơ bản
//                         });

//                         return { ...orderListUser.toObject(), productsid: orderProducts };
//                     });
//                     res.locals.orderListUsersWithProductsAll = orderListUsersWithProducts;
//                     next();
//                 })
//                 .catch(err => {
//                     console.error(err);
//                     res.status(500).send("Đã xảy ra lỗi khi tìm sản phẩm.");
//                 });
//         })
//         .catch(err => {
//             console.error(err);
//             res.status(500).send("Đã xảy ra lỗi khi tìm đơn hàng.");
//         });
// };
exports.getOrderInfoAdmin = (req, res, next) => {
    OrderListUser.find({})
    .then(orderListUsers => {
        if (!orderListUsers || orderListUsers.length === 0) {
            return res.status(404).send("Không tìm thấy đơn hàng.");
        }
        // res.json(orderListUsers);
        req.orderListAll = orderListUsers;
        next();
    })
    .catch(err => {
        console.error(err);
        res.status(500).send("Đã xảy ra lỗi khi tìm đơn hàng.");
    });
};



// lấy ra thông tin sản phẩm cho bill theo slus
// exports.productInformationSlug = (req, res, next) => {
//     OrderListUser.findOne({ slug: req.params.slug })
//         .then(order => {
//             if (!order) {
//                 return res.status(404).json({ error: 'Order not found' });
//             }

//             req.order = order;

//             const productIdPromises = order.productsid.map(async (product) => {
//                 let productInfo;
//                 if (typeof product.productId === 'object') {
//                     productInfo = product.productId;
//                 } else {
//                     productInfo = await Products.findOne({ _id: product.productId });
//                 }
                
//                 if (!productInfo) {
//                     throw new Error("Không tìm thấy thông tin sản phẩm.");
//                 }

//                 return {
//                     product: productInfo,
//                     quantity: product.quantity,
//                     size: product.size,
//                     color: product.color,
//                 };
//             });

//             Promise.all(productIdPromises)
//                 .then(products => {
//                     req.order.productsid = products;
//                     next();
//                 })
//                 .catch(error => {
//                     console.error(error);
//                     return res.status(500).send("Đã xảy ra lỗi khi tìm thông tin sản phẩm.");
//                 });
//         })
//         .catch(next);
// }
exports.productInformationSlug = (req, res, next) => {
    OrderListUser.findOne({ slug: req.params.slug })
        .then(orderListUsers => {
            if (!orderListUsers) {
                return res.status(404).json({ error: 'Order not found' });
            }
            const productIds = orderListUsers.productsid.map(product => product.productId);

            // Tìm tất cả các sản phẩm có trong danh sách productIds
            Products.find({ _id: { $in: productIds } })
                .then(products => {
                    if (!products || products.length === 0) {
                        return res.status(404).send("Không tìm thấy sản phẩm.");
                    }

                    const transformedData = { ...orderListUsers.toObject() };

                    transformedData.productsid.forEach(product => {
                        const productId = product.productId;
                        const foundProduct = products.find(p => p._id.toString() === productId.toString());
                        if (foundProduct) {
                            product.productId = foundProduct;
                        } else {
                            // Nếu không tìm thấy productId, bạn có thể xử lý theo ý định của bạn, ví dụ: gán một giá trị mặc định hoặc xử lý lỗi.
                            product.productId = null; // Hoặc bất kỳ giá trị mặc định nào bạn muốn
                        }
                    });
                    // res.json(transformedData);
                    req.order = transformedData; // Gán dữ liệu đã được biến đổi vào yêu cầu để sử dụng sau này
                    next();
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send("Đã xảy ra lỗi khi tìm sản phẩm.");
                });
        })
        .catch(next);
}






// Cập nhật lại số lượng sản phẩm
// [PATCH] /carts/updateQuantity
// exports.updateQuantity = async (req, res, next) => {
//     const { productId, quantity } = req.body;

//     console.log("Request Body:", req.body); // Kiểm tra req.body

//     if (!productId || !quantity) {
//         return res.status(400).json({ error: 'Product ID and quantity are required' });
//     }

//     try {
//         // Tìm sản phẩm trong giỏ hàng theo productId
//         const cartItem = await Carts.findOne({ productid: productId });

//         if (!cartItem) {
//             return res.status(404).json({ error: 'Product not found in cart' });
//         }

//         // Cập nhật số lượng và tổng tiền
//         const pricePerUnit = cartItem.totalmoney / cartItem.quantity; // assuming totalmoney is initially price * quantity
//         cartItem.quantity = quantity;
//         cartItem.totalmoney = pricePerUnit * quantity;

//         // Lưu thay đổi vào MongoDB
//         await cartItem.save();

//         res.status(200).json({ message: 'Quantity and total amount updated successfully' });
//     } catch (error) {
//         next(error);
//     }
// };