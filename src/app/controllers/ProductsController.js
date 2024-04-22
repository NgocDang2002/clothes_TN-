const Products = require('../models/Products-models');

const { mutipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');

var path = require('path');
const fs = require('fs');



class ProductsController {
    
    // [GET] / products
    index (req,res,next) {
        Products.find({})
            .then(product => {
                res.render('products',  { 
                    product: mutipleMongooseToObject(product),
                    isAuthenticated: res.locals.isAuthenticated,
                    user: mongooseToObject(res.locals.user),
                });     
                // res.send(product)
                
            })
            .catch(next);
        // return res.render('products');
    }

    // [GET] / products/:slug
    information(req,res,next){
        Products.findOne({ slug: req.params.slug })
            .then( (product) => {
                res.render('products/information', {           
                    product: mongooseToObject(product),
                    isAuthenticated: res.locals.isAuthenticated,
                    user: mongooseToObject(res.locals.user),
                });
            })
            .catch(next);
    }


    // [GET] / products/create
    create(req,res,next){
        res.render('products/create', {
            isAuthenticated: res.locals.isAuthenticated,
            user : mongooseToObject(req.user),
        });
    }

      // [POST] / products/store
    store(req,res,next){
        // res.json(req.body);
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        else{
            const product = new Products({
                name: req.body.name,
                description: req.body.description,
                image: '/uploads/' + req.file.filename,
                price: req.body.price,
                color: req.body.color,
            });
            product.save()
                .then(() => res.redirect('stored',{
                    isAuthenticated: res.locals.isAuthenticated,
                    user : mongooseToObject(req.user),
                }))
                .catch((err) => {
                    console.error(err);
                    res.status(500).send('Error uploading file and creating user.');
                });
        }
        
    }
    // [GET] / products/:id/edit
    edit(req,res,next){
        Products.findById(req.params.id)
            .then(product => res.render('products/edit' ,{
                product: mongooseToObject(product),
                isAuthenticated: res.locals.isAuthenticated,
                user : mongooseToObject(req.user),
            }))
            .catch(next);
    }
    // [Put] / products/:id
    update(req,res,next){
        Products.updateOne({_id:req.params.id} , req.body)
            .then(() => res.redirect('stored', {
                isAuthenticated: res.locals.isAuthenticated,
                user : mongooseToObject(req.user),
            }))
            .catch(next);
        // res.json(req.body);
        
    }
    // [Delete] /products/:id
    delete(req,res,next){
        Products.delete({_id:req.params.id})
            .then(() => res.redirect('back')) 
            .catch(next);
    }
    // [Delete] /products/:id/force
    forceDestroy(req,res,next){
        Products.deleteOne({_id:req.params.id})
            .then(() => res.redirect('back')) 
            .catch(next);
    }
    

    // [PATCH] /products/:id/restore
    restore(req,res,next){
        Products.restore({_id:req.params.id})
            .then(() => res.redirect('back')) 
            .catch(next);

    }
    // [POST] /products/handle-form-actions
    handleFormActions(req, res ,next){
        switch (req.body.action) {
            case'delete':
            Products.delete({ _id: {$in: req.body.productIds}})
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({ message: 'Action is invalid' });
        }
    }

    // hiển thị danh sách sản phẩm
    // [GET] /admin/stored/products
    storedProducts (req,res,next) {

        let productsQuery = Products.find({});

        if(req.query.hasOwnProperty('_sort')){
            productsQuery = productsQuery.sort({
                [req.query.column]: req.query.type,
            });
            // res.json({message: "message"});
        }


        Promise.all([productsQuery, Products.countDocumentsDeleted()])
            .then(([products, deleteCount]) =>  
                res.render('products/stored' , {
                    deleteCount,
                    products : mutipleMongooseToObject(products),
                    isAuthenticated: res.locals.isAuthenticated,
                    user : mongooseToObject(req.user),
                })
            )
            .catch(next);
    }

    // [GET] /admin/trash/products
    trashProducts(req,res,next) {
        Products.findDeleted({ deleted: { $exists: true }})
        .then( product => res.render('products/trash' , {
            product: mutipleMongooseToObject(product),
            isAuthenticated: res.locals.isAuthenticated,
            user : mongooseToObject(req.user),
        }))
        .catch(next);
        
    }
        


}

module.exports = new ProductsController();
