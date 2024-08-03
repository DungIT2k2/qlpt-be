const Account = require('../models/Account')
const Room = require('../models/Room')
const bcrypt = require('bcryptjs')

class accountController {
    async show(req, res) {
        try {
            const result = await Account.find().sort({ _id: 1 }).lean().exec();
            const data = result.map((item) => {
                const { password, ...rest } = item;
                return rest;
            })
            return res.send({
                status: 200,
                data: data,
            })
        } catch (error) {
            return res.status(500).send({
                message: error.message
            })
        }
    }
    async create(req, res) {
        const username = req?.body?.username;
        const result = await Account.find({ username }).lean().exec();
        if (result && result.length > 0) {
            return res.status(400).send({ message: "Username đã tồn tại" });
        }
        const user = new Account(req.body);
        if (!user) return res.status(500).send({
            message: "Tạo tài khoản không thành công"
        })
        //hash password bcrypt
        const Salt = 10;
        const hashedPassword = await bcrypt.hash(user.password, Salt);
        user.password = hashedPassword;
        try {
            const result = await user.save();
            return res.send({
                status: 200,
                message: "Tạo tài khoản thành công",
                result
            });
        } catch (error) {
            return res.status(500).send({
                message: error.message
            });
        }
    }
    async delete(req, res) {
        try {
            const result = await Account.deleteOne({ _id: req.body.id })
            if (!result) return res.status(500).send({
                message: "Xóa tài khoản không thành công"
            })
            if (result.deletedCount == 0) return res.status(500).send({
                message: "Không tìm thấy tài khoản cần xóa"
            })
            return res.send({
                message: "Xóa tài khoản thành công"
            });
        } catch (error) {
            return res.status(500).send({
                message: error.message
            });
        }
    }
}

module.exports = new accountController;