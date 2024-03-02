const express = require('express');
const route = express.Router();
const RoomController = require('../app/controllers/roomController');

route.get('/create', RoomController.create);
route.post('/created', RoomController.created);
route.get('/:id/edit', RoomController.edit);
route.put('/:id', RoomController.update);
route.delete('/:id', RoomController.delete);
route.get('/', RoomController.show);


module.exports = route;