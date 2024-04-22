const User = require('../models/User-models');
const { mutipleMongooseToObject , mongooseToObject } = require('../../util/mongoose');


class SiteController {
    
    // [GET] /
    index (req,res) {
        res.render('home', {
            isAuthenticated: res.locals.isAuthenticated,
            user : mongooseToObject(req.user), // Đã được lưu trong middleware authenticateUser
        });
    }
    


    // [GET] / search
    // search (req,res,) {
    //     res.send("qua bai");
    // }

}

module.exports = new SiteController();
