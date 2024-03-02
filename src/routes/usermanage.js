const express = require('express');
const route = express.Router();
const usermanageController = require('../app/controllers/usermanageController');

route.get('/signup', usermanageController.add);
route.post('/created', usermanageController.created);
route.delete('/:id', usermanageController.delete);
route.get('/', usermanageController.show);

module.exports = route;