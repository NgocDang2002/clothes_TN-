const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ColorProduct = new Schema(
    {
        name: { type: String,maxLength : 255},
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model('ColorProduct',ColorProduct);