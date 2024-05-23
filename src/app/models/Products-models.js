const mongoose = require('mongoose');
// const slug = require('mongoose-slug-generator');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);



const Schema = mongoose.Schema;

const Products = new Schema(
  {
    _id: {type: Number},
    name: {type : String , required: true},
    description: {type : String , maxLength : 600},
    image: {type : String , maxLength : 255},
    price: {type : Number, required: true},
    colors: [{type : String, required: true}],
    sizes: [{ type: String, required: true }],
    slug: {type: String, slug: ["name", "_id"], unique: true,},
    categories: { type: String, required: true},
    quantity: { type: Number, required: true},
    deleted: { type: Boolean, default: false },
  },
  {
    _id: false,
    // timestamps: true,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
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
