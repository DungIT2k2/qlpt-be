const { default: mongoose } = require('mongoose');
const User = require('../models/Account');
const Payment = require('../models/Payment');
const { formattedMoney } = require('../ultils/commonFunction');
const { StatusCodes } = require('http-status-codes');

class userController {
    async get(req, res) {
        try {
            const id = req.user?._id;
            if (!id) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Wrong body!"
            })
            if (id && mongoose.Types.ObjectId.isValid(id)) {
                const dataRes = await User.findById({ _id: id })
                return res.status(StatusCodes.OK).send({
                    status: StatusCodes.OK,
                    data: {
                        username: dataRes?.admin,
                        name: dataRes?.name,
                        role: dataRes?.role,
                        room: dataRes.room ? dataRes?.room : ""
                    }
                });
            }
            return res.status(StatusCodes.NOT_FOUND).send({
                status: StatusCodes.NOT_FOUND,
                data: {}
            })
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: error.message
            })
        }
    }
    async checkPayment(req, res, next) {
        try {
            const id = req.user?._id;
            var month = req.body?.month;
            var year = req.body?.year;
            if (id) {
                const dataUser = await User.findById({ _id: id }).lean();
                const room = dataUser?.room;
                if (room) {
                    const dataPayment = await Payment.findOne({ name: room, month: month, year: year }).lean();
                    if (dataPayment) {
                        delete dataPayment._id;
                        return res.status(StatusCodes.OK).send({
                            status: StatusCodes.OK,
                            data: {
                                ...dataPayment,
                                eTotal: parseFloat(dataPayment.eTotal).toLocaleString('vi-VN', { minimumFractionDigits: 0 }),
                                wTotal: parseFloat(dataPayment.wTotal).toLocaleString('vi-VN', { minimumFractionDigits: 0 }),
                                totalPay: parseFloat(dataPayment.totalPay).toLocaleString('vi-VN', { minimumFractionDigits: 0 }) 
                            }
                        });
                    } else {
                        return res.status(StatusCodes.NOT_FOUND).send({
                            status: StatusCodes.NOT_FOUND,
                            message: `Thông tin thanh toán tháng ${month} năm ${year} chưa có`
                        });
                    }
                }
            }
            return res.status(StatusCodes.NOT_FOUND).send({
                status: StatusCodes.NOT_FOUND,
                message: "Không tìm thấy thông tin thanh toán"
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: error.message
            })
        }
    }
}

module.exports = new userController