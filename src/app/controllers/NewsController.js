
const { mutipleMongooseToObject , mongooseToObject } = require('../../util/mongoose');

class NewsController {
    // [GET] / news
    index (req,res) {
        res.render('news', {
            isAuthenticated: res.locals.isAuthenticated,
            // user : mongooseToObject(req.user), // Đã được lưu trong middleware authenticateUser
            users: mongooseToObject(res.locals.users)
        });
    }
    // [GET] / news /:slug
    show (req,res,) {
        res.send("qua bai");
    }

}

module.exports = new NewsController();
