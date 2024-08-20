const User = require('../models/Account');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class loginController {
  login(req, res) {
    const user = new User(req.body);
    User.findOne({ username: user.username })
      .then(async (User) => {
        // console.log(User);
        User = User.toObject();
        const checkPassCorrect = await bcrypt.compare(
          user.password,
          User.password
        );
        const message = "Sai mật khẩu";
        if (!checkPassCorrect) {
          res.status(401).send({ message });
        } else {
          const payload = {
            _id: User._id,
            name: User.name,
            role: User.role,
            room: User.room,
          };
          const secretKey = process.env.SECRET_KEY || "jwt-test";
          const token = jwt.sign(payload, secretKey, {
            expiresIn: 60 * 60 * 24,
          });
          res.cookie('myToken', token);
          res.status(200).json({
            message: "Đăng Nhập Thành Công",
            accessToken: token,
          });
        }
      })
      .catch(() => {
        const message = "Sai tài khoản";
        res.status(401).send({ message });
      });
  }
  logout(req, res, next) {
    const cookies = Object.keys(req.cookies);
    cookies.forEach((cookie) => {
      res.cookie(cookie, "", { expires: new Date(0) });
    });
  }
}

module.exports = new loginController();
