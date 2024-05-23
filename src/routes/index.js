const newRouter = require('./news.routes');
const userRouter = require('./user.routes');
const productsRouter = require('./products.routes');
const cartsRouter = require('./carts.routes');
const siteRouter = require('./site.routes');



function route(app){

    app.get('/logoutUser', userRouter);

    // admin
    app.use('/admin', userRouter);
    // producs
    app.use('/products',productsRouter);
    // Cart
    app.use('/carts',cartsRouter);
    // news
    app.use('/news',newRouter);
    // Home
    app.use('/',siteRouter);
    
      
      
}

module.exports = route;
