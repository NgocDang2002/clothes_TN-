const mongoose = require('mongoose');
// const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
// const AutoIncrement = require('mongoose-sequence')(mongoose);

// const { connect } = require('../../config/db/index');


const Schema = mongoose.Schema;


const User = new Schema(
  {
    // _id: {type: Number},
    name: {type : String , required: true},
    image: {type : String , maxLength : 255},
    email: {type : String , required: true, unique: true},
    username:{type : String , required: true},
    password: {type : String , required: true},
    phone: {type : String , required: true},
    address: {type : String , required: true},
    gender: {type : String , required: true},
    position: {type: String},
    role:{type : String, default: 'user'},
    // deleted: { type: Boolean, default: false },
  },
  {
    // _id: false,
    timestamps: true,
  },
);



// App plugin
// mongoose.plugin(slug);
// User.plugin(AutoIncrement);
User.plugin(mongooseDelete , {
  deletedAt : true,
  overrideMethods: 'all',
});

module.exports = mongoose.model('Users', User);
