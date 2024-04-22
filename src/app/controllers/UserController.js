
const User = require('../models/User-models');
const { mutipleMongooseToObject , mongooseToObject } = require('../../util/mongoose');



class UserController {

    // [GET] admin/user
    index(req,res,next){
        User.find({})
            .then(users => res.render('admin/user', {
            isAuthenticated: res.locals.isAuthenticated,
            user : mongooseToObject(req.user),
            users: mutipleMongooseToObject(users),
            }))
            .catch(next);
    }

    // [GET] admin/login
    login(req,res,next){
        res.render('admin/login');
    }

    // [POST] admin/loginUser
    loginUser(req,res,next){
        const { username } = req.body;
        const isAuthenticated = req.session.isAuthenticated;
        User.findOne({username})
            .then(user => {
                res.render('home',{
                    // condition: true,
                    isAuthenticated,
                    user : mongooseToObject(user),
                })
                req.session.user = { username }; 
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ message: error.message });
            })
    }
    // [Get] admin/logoutUser
    logoutUser(req, res, next) {
        // Xóa thông tin người dùng khỏi session
        delete req.session.user;
        // Đặt trạng thái xác thực thành false
        req.session.isAuthenticated = false;
        res.redirect('/'); // Hoặc chuyển hướng đến trang khác sau khi đăng xuất
    }
    

    // [GET] admin/register
    register(req,res,next){
        res.render('admin/register');
    }
    // [POST] admin/position
    position(req,res,next){
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
      else{
        const newUser = new User ({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            username: req.body.username,
            password: req.body.password,
            address: req.body.address,
            gender: req.body.gender,
            image: '/uploads/' + req.file.filename,
        });
        newUser.save()
            .then (() => {
                res.redirect('/');
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error uploading file and creating user.');
            });
      }
    }

    // handleFormActions(req, res ,next){
    //     switch (req.body.action) {
    //         case'delete':
    //         User.delete({ _id: {$in: req.body.UserIds}})
    //                 .then(() => res.redirect('back'))
    //                 .catch(next);
    //             break;
    //         default:
    //             res.json({ message: 'Action is invalid' });
    //     }
    // }


}

module.exports = new UserController();
