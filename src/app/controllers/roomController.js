const Room = require('../models/Room');

class roomController {
    async getAll(req, res) {
        try {
            const dataRes = await Room.find().sort({ _id: 1 }).exec();
            return res.send({
                status: 200,
                data: dataRes,
            })
        } catch (error) {
            return res.status(500).send({
                message: error.message
            })
        }
    }
    async get(req, res) {
        try {
            const id = req?.body?.id;
            const dataRes = await Room.findById(id)
            return res.send({
                status: 200,
                data: dataRes,
            })
        } catch (error) {
            return res.status(500).send({
                message: error.message
            })
        }
    }
    async create(req, res) {
        const room = new Room(req.body);
        if (!room) return res.status(500).send({
            message: "Tạo mới phòng không thành công"
        })
        room.status = "uncheck";
        try {
            const result = await room.save();
            return res.send({
                status: 200,
                message: "Tạo mới phòng thành công",
                result
            });
        } catch (error) {
            return res.status(500).send({
                message: error.message
            });
        }
    }
    async update(req, res) {
        try {   
            const id = req.body.id;
            const dataUpdate = req?.body?.dataUpdate;
            if (!dataUpdate) return res.send({
                status: 500,
                message: "Không có thông tin cần cập nhật"
            })
            const result = await Room.updateOne({ _id: id }, dataUpdate)
            if (result.matchedCount == 0) return res.send({
                status: 500,
                message: "Không tìm thấy phòng cần cập nhật"
            })
            return res.send({
                status: 200,
                message: "Cập nhật thông tin phòng thành công.",
            })
        } catch (error) {
            return res.status(500).send({
                message: error.message
            });
        }
    }
    async delete(req, res) {
        try {
            const id = req.body.id;
            const result = await Room.deleteOne({ _id: id })
            if (!result) return res.status(500).send({
                message: "Xóa phòng không thành công"
            })
            if (result.deletedCount == 0) return res.status(500).send({
                message: "Không tìm thấy phòng cần xóa"
            })
            return res.send({
                message: "Xóa phòng thành công"
            });
        } catch (error) {
            return res.status(500).send({
                message: error.message
            });
        }
    }
}

module.exports = new roomController;