const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Carts =  new Schema(
    {
        userid: {type : String, required: true},
        productid: {type : Number, required: true},
        quantity: { type: Number, required: true},
        size: {type : String, required: true},
        totalmoney: {type : Number, required: true},
        color:{type : String, required: true},
    }
)
module.exports = mongoose.model('Carts',Carts);