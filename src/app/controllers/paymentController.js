const { StatusCodes } = require('http-status-codes');
const Payment = require('../models/Payment');
const Ultility = require('../models/Utility');
const { default: mongoose } = require('mongoose');

class paymentController {
    async get(req, res) {
        try {
            const month = req.body?.month;
            const year = req.body?.year;
            if (month && year) {
                const data = await Payment.find({ month: month, year: year }).lean().exec();
                data.forEach(item => {
                    item.totalPay = parseFloat(item.totalPay).toLocaleString('vi-VN', { minimumFractionDigits: 0 });
                    item.wTotal = parseFloat(item.wTotal).toLocaleString('vi-VN', { minimumFractionDigits: 0 });
                    item.eTotal = parseFloat(item.eTotal).toLocaleString('vi-VN', { minimumFractionDigits: 0 });
                })
                return res.status(StatusCodes.OK).send({
                    status: StatusCodes.OK,
                    data: data
                });
            }
            return res.status(StatusCodes.NOT_FOUND).send({
                status: StatusCodes.NOT_FOUND,
                message: "Không tìm thấy dữ liệu"
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: error.message
            });
        }
    }
    async calNewPayment(monthNew, yearNew) {
        var monthOld;
        var yearOld;
        if (monthNew == 1) {
            monthOld = 12;
            yearOld = yearNew - 1;
        }
        else {
            monthOld = monthNew - 1;
            yearOld = yearNew;
        }

        const ultilitiesNew = await Ultility.find({ month: monthNew, year: yearNew }).sort({ _id: 1 }).lean().exec();

        const ultilitiesOld = await Ultility.find({ month: monthOld, year: yearOld }).sort({ _id: 1 }).lean().exec();

        if (!ultilitiesNew && !ultilitiesOld) return false;

        var paymentList = [];
        ultilitiesNew.forEach(item => {
            const name = item?.name
            const itemMappedOld = ultilitiesOld.filter(item => item.name == name);
            if (itemMappedOld && itemMappedOld.length == 1) {
                const itemOld = itemMappedOld[0];
                const eNew = item.electricity ? item.electricity : 0;
                const wNew = item.water ? item.water : 0;
                const eOld = itemOld.electricity ? itemOld.electricity : 0;
                const wOld = itemOld.water ? itemOld.water : 0;
                const eTotal = (eNew - eOld) * 4000;
                const wTotal = (wNew - wOld) * 6000;
                const totalPay = eTotal + wTotal + 20000;
                paymentList.push({
                    name: name,
                    month: monthNew,
                    year: yearNew,
                    eNew: eNew,
                    wNew: wNew,
                    eOld: eOld,
                    wOld: wOld,
                    eConsumption: eNew - eOld,
                    wConsumption: wNew - wOld,
                    eTotal: eTotal,
                    wTotal: wTotal,
                    totalPay: totalPay,
                    status: false
                })
            }
        })
        if (paymentList && paymentList.length > 0) {
            await Payment.insertMany(paymentList);
            return true;
        }
        return false;
    }

    async calManual(req, res) {
        try {
            const month = req.body?.month;
            const year = req.body?.year;
            if (month && year) {
                const result = await this.calNewPayment(month, year);
                if (result) {
                    return res.status(StatusCodes.OK).send({
                        status: StatusCodes.OK,
                        message: `Đã tính toán điện, nước cho tháng ${month} năm ${year}`,
                    });
                }
            }
            return res.status(StatusCodes.OK).send({
                status: StatusCodes.OK,
                message: `Tính toán điện, nước không thành công`,
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: error.message
            });
        }
    }

    async pay(req, res, next) {
        try {
            const id = req.body?.id;
            if (id && mongoose.Types.ObjectId.isValid(id)) {
                const result = await Payment.updateOne({ _id: id }, { status: "true" }).lean();
                if (result && result.modifiedCount == 1) {
                    return res.status(StatusCodes.OK).send({
                        status: StatusCodes.OK,
                        message: `Thanh toán thành công`,
                    });
                }
                if (result && result.matchedCount == 1) {
                    return res.status(StatusCodes.OK).send({
                        status: StatusCodes.OK,
                        message: `Đã thanh toán rồi`,
                    });
                }
            }
            return res.status(StatusCodes.NOT_FOUND).send({
                status: StatusCodes.NOT_FOUND,
                message: `Thanh toán không thành công`,
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: error.message
            });
        }
    }

}

module.exports = new paymentController;