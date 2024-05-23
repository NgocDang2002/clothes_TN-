const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SizeProduct = new Schema(
    {
        name: { type: String,maxLength : 255},
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model('SizeProduct',SizeProduct);