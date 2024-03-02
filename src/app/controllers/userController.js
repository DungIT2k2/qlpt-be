const User = require('../models/User');
const Payment = require('../models/Payment');

class userController {
    index(req, res, next) {
        const id = req.user._id
        User.findById({ _id: id })
            .then(User => {
                User = User.toObject();
                res.render('userHome', { User });
            })
            .catch(next)
    }
    check(req, res, next) {
        const id = req.user._id
        var month;
        var year;
        if (req.query.month && req.query.year) {
            month = req.query.month;
            year = req.query.year;
        }
        else {
            month = req.cookies['monthLast'];
            year = req.cookies['yearLast'];
        }
        if (month == undefined || year == undefined) {
            month = 1;
            year = 2023;
        }
        res.cookie('monthLast', month);
        res.cookie('yearLast', year);
        User.findById({ _id: id })
            .then(User => {
                User = User.toObject();
                const room = User.room;
                Payment.findOne({ name: room, month: month, year: year })
                    .then(Payment => {
                        var status;
                        if (!Payment) {
                            status = "Không tồn tại"
                            res.render('payments/checkpayment', { status })
                        }
                        else {
                            Payment = Payment.toObject();
                            if (Payment.status == true) {
                                status = "Đã thanh toán"
                            }
                            else {
                                status = "Chưa thanh toán"
                            }
                            res.render('payments/checkpayment', { Payment, status })
                        }
                    })
            })
            .catch(next)
    }
}

module.exports = new userController