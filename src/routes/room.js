const express = require('express');
const route = express.Router();
const RoomController = require('../app/controllers/roomController');

route.post('/create', RoomController.create);
route.put('/update', RoomController.update);
route.delete('/delete', RoomController.delete);
route.get('/get', RoomController.getAll);
route.post('/get', RoomController.get)


module.exports = route;