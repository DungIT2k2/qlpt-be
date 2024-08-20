const Utility = require('../models/Utility');
const Room = require('../models/Room');

class utilityController {
    async getList(req, res) {
        var monthNew = +req?.body?.month;
        var yearNew = +req?.body?.year;
        if (!monthNew || !yearNew) {
            return res.status(500).send({
                message: "Wrong body"
            })
        }
        var monthOld;
        var yearOld;
        if (+monthNew == 1) {
            monthOld = 12;
            yearOld = +yearNew - 1;
        }
        else {
            monthOld = +monthNew - 1;
            yearOld = +yearNew;
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
            return res.send({
                data: dataRes
            });
        } catch (error) {
            return res.status(500).send({
                message: error.message
            })
        }
    }

    async create(req, res) {
        const data = req.body;
        if (!data) return res.status(500).send({ message: "Wrong body" });
        const result = await Utility.find({ name: data[0].name, month: data[0].month, year: data[0].year });
        if (result && result.length > 0) return res.status(500).send({
            message: "Điện nước tháng này đã có, vui lòng sửa nếu cần"
        });
        try {
            const dataRes = await Utility.insertMany(data);
            return res.send({
                message: "Thêm điện, nước thành công",
                data: dataRes
            });
        } catch (error) {
            return res.status(500).send({
                message: error.message
            })
        }
    }

    async update(req, res) {    
        const data = req?.body;
        if (!data) return res.status(500).send({ message: "Wrong body" });
        try {
            const bulkUpdateOps = data.map(({ id, electricity, water }) => ({
                updateOne: {
                    filter: { _id: id },
                    update: { $set: { electricity, water } }
                }
            }));

            await Utility.bulkWrite(bulkUpdateOps);
            return res.send({
                message: "Cập nhật điện, nước thành công"
            });
        } catch (error) {
            return res.status(500).send({
                message: error.message
            })
        }
    }
}

module.exports = new utilityController;