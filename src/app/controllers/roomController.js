const { StatusCodes } = require('http-status-codes');
const Room = require('../models/Room');
const { default: mongoose } = require('mongoose');

class roomController {
    async getAll(req, res) {
        try {
            const dataRes = await Room.find().sort({ _id: 1 }).exec();
            return res.status(StatusCodes.OK).send({
                status: 200,
                data: dataRes,
            })
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: error.message
            })
        }
    }
    async get(req, res) {
        try {
            const id = req?.body?.id;
            if (id && mongoose.Types.ObjectId.isValid(id)) {
                const dataRes = await Room.findById(id);
                // console.log(dataRes);
                return res.status(StatusCodes.OK).send({
                    status: 200,
                    data: dataRes,
                })
            }
            return res.status(StatusCodes.NOT_FOUND).send({
                status: StatusCodes.NOT_FOUND,
                message: "Không tìm thấy id phòng",
            })
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: error.message
            })
        }
    }
    async create(req, res) {
        const body = req.body
        if (!body.name || !body.status) return res.status(StatusCodes.BAD_REQUEST).send({
            message: "Tạo mới phòng không thành công"
        })

        const check = await Room.find({ name: body.name }).lean();
        if (check && check.length > 0) return res.status(StatusCodes.CONFLICT).send({
            message: "Tên phòng đã tồn tại"
        })

        const room = new Room(body);
        if (!room?.status) {
            room.status = "uncheck";
        }

        try {
            const result = await room.save();
            return res.status(StatusCodes.OK).send({
                status: 200,
                message: "Tạo mới phòng thành công",
                result
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: error.message
            });
        }
    }
    async update(req, res) {
        try {
            const id = req.body.id;
            const dataUpdate = req?.body?.dataUpdate;
            if (!dataUpdate) return res.status(StatusCodes.NOT_MODIFIED).send({
                status: 500,
                message: "Không có thông tin cần cập nhật"
            })
            const result = await Room.updateOne({ _id: id }, dataUpdate)
            if (result.matchedCount == 0) return res.status(StatusCodes.CONFLICT).send({
                status: 500,
                message: "Không tìm thấy phòng cần cập nhật"
            })
            return res.status(StatusCodes.OK).send({
                status: 200,
                message: "Cập nhật thông tin phòng thành công.",
            })
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: error.message
            });
        }
    }
    async delete(req, res) {
        try {
            const id = req.body.id;
            const result = await Room.deleteOne({ _id: id })
            if (!result) return res.status(StatusCodes.NOT_MODIFIED).send({
                message: "Xóa phòng không thành công"
            })
            if (result.deletedCount == 0) return res.status(StatusCodes.CONFLICT).send({
                message: "Không tìm thấy phòng cần xóa"
            })
            return res.status(StatusCodes.OK).send({
                message: "Xóa phòng thành công"
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: error.message
            });
        }
    }
}

module.exports = new roomController;