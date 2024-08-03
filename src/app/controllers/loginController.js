const User = require('../models/Account');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class loginController {
    index(req, res, next) {
        res.render('login');
    }
    login(req, res, next) {
        const user = new User(req.body);
        User.findOne({ username: user.username })
            .then(async (User) => {
                // console.log(User);
                User = User.toObject();
                const checkPassCorrect = await bcrypt.compare(user.password, User.password);
                const noti = "Sai mật khẩu !!!"
                if (!checkPassCorrect) {
                    res.render('login', { noti });
                }
                else {
                    const payload = {
                        _id: User._id,
                        name: User.name,
                        role: User.role,
                        room: User.room
                    }
                    const secretKey = process.env.SECRET_KEY || 'jwt-test';
                    const token = jwt.sign(payload, secretKey, { expiresIn: 60 * 60 * 24 });
                    res.cookie('Auth-Token', token);
                    if (User.role == 'Manage') {
                        res.redirect('/manage')
                    }
                    if (User.role == 'User') {
                        res.redirect('/user')
                    }
                }
            })
            .catch(() => {
                const noti = "Sai tài khoản !!!"
                res.render('login', { noti });
            })
    }
    logout(req, res, next) {
        const cookies = Object.keys(req.cookies);
        cookies.forEach(cookie => {
            res.cookie(cookie, '', { expires: new Date(0) });
        });
        res.redirect('/');
    }
}

module.exports = new loginController