
const { mutipleMongooseToObject , mongooseToObject } = require('../../util/mongoose');

class NewsController {
    // [GET] / news
    index (req,res) {
        res.render('news', {
            isAuthenticated: res.locals.isAuthenticated,
            isAdmin: res.locals.isAdmin, // Truyền giá trị isAdmin vào template
            user: mongooseToObject(res.locals.user)
        });
    }
    // [GET] / news /:slug
    show (req,res,) {
        res.send("qua bai");
    }

}

module.exports = new NewsController();
