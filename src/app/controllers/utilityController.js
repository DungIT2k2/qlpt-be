const Utility = require('../models/Utility');
const Room = require('../models/Room');
const { StatusCodes } = require('http-status-codes');
const paymentController = require('./paymentController');

class utilityController {
    async getList(req, res) {
        var monthNew = +req?.body?.month;
        var yearNew = +req?.body?.year;
        if (!monthNew || !yearNew) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                message: "Wrong body"
            })
        }
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
        try {
            const utilitiesNew = await Utility.find({ month: monthNew, year: yearNew }).sort({ _id: 1 }).lean();

            const utilitiesOld = await Utility.find({ month: monthOld, year: yearOld }).sort({ _id: 1 }).lean();
            var dataRes = [];
            for (let i = 0; i < utilitiesNew.length; i++) {
                dataRes.push({
                    name: utilitiesNew[i].name,
                    monthNew: utilitiesNew[i].month,
                    yearNew: utilitiesNew[i].year,
                    electricityNew: utilitiesNew[i].electricity,
                    waterNew: utilitiesNew[i].water,
                    monthOld: utilitiesOld[i].month,
                    yearOld: utilitiesOld[i].year,
                    electricityOld: utilitiesOld[i].electricity,
                    waterOld: utilitiesOld[i].water,
                    electricityTotal: utilitiesNew[i].electricity - utilitiesOld[i].electricity,
                    waterTotal: utilitiesNew[i].water - utilitiesOld[i].water,
                })
            }
            return res.status(StatusCodes.OK).send({
                data: dataRes
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: error.message
            })
        }
    }

    async create(req, res) {
        const data = req.body?.data;
        const month = req.body?.month;
        const year = req.body?.year;
        
        if (!data || !month || !year) return res.status(StatusCodes.BAD_REQUEST).send({ message: "Wrong body" }); 
        const result = await Utility.find({ month: month, year: year }).lean();
        if (result && result.length > 0) return res.status(StatusCodes.CONFLICT).send({
            message: "Điện nước tháng này đã có, vui lòng sửa nếu cần"
        });
        try {
            const dataCreate = data.map(item => {
                return {
                    ...item,
                    month: month,
                    year: year
                }
            })
            await Utility.insertMany(dataCreate);
            const calPayment = await paymentController.calNewPayment(month, year);
            if (calPayment){
                return res.status(StatusCodes.OK).send({
                    message: "Thêm điện, nước thành công",
                    sub_message: `Đã tính toán điện, nước cho tháng ${month} năm ${year}`,
                    data: dataCreate
                });
            }
            return res.status(StatusCodes.OK).send({
                message: "Thêm điện, nước thành công",
                sub_message: `Chưa Tính toán điện, nước cho tháng ${month} năm ${year}`,
                data: dataCreate
            });
            
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: error.message
            })
        }
    }

    async update(req, res) {    
        const data = req?.body;
        if (!data) return res.status(StatusCodes.BAD_REQUEST).send({ message: "Wrong body" });
        try {
            const bulkUpdateOps = data.map(({ id, electricity, water }) => ({
                updateOne: {
                    filter: { _id: id },
                    update: { $set: { electricity, water } }
                }
            }));

            await Utility.bulkWrite(bulkUpdateOps);
            return res.status(StatusCodes.OK).send({
                message: "Cập nhật điện, nước thành công"
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: error.message
            })
        }
    }
}

module.exports = new utilityController;