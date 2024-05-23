const user = require('../models/User-models');
const { mutipleMongooseToObject , mongooseToObject } = require('../../util/mongoose');


class SiteController {
    
    // [GET] /
    index (req,res) {
        res.render('home', {
            isAuthenticated: res.locals.isAuthenticated,
            isAdmin: res.locals.isAdmin, // Truyền giá trị isAdmin vào template
            user : mongooseToObject(req.user), // Đã được lưu trong middleware authenticateUser
        });
    }
    


    // [GET] / search
    // search (req,res,) {
    //     res.send("qua bai");
    // }

}

module.exports = new SiteController();
