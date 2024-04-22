const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);

// const { connect } = require('../../config/db/index');


const Schema = mongoose.Schema;


// Tạo một kết nối mới đến cơ sở dữ liệu cụ thể
// mongoose.connect('product');

// connect('product');


const Products = new Schema(
  {
    _id: {type: Number},
    name: {type : String , required: true},
    description: {type : String , maxLength : 600},
    image: {type : String , maxLength : 255},
    price: {type : Number, required: true},
    color:{type : String, required: true},
    slug: {type: String, slug: 'name'},
    deleted: { type: Boolean, default: false },
  },
  {
    _id: false,
    timestamps: true,
  },
);



// App plugin
mongoose.plugin(slug);
Products.plugin(AutoIncrement);
Products.plugin(mongooseDelete , {
  deletedAt : true,
  overrideMethods: 'all',
});

module.exports = mongoose.model('Products', Products);
