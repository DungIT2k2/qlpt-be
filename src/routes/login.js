const express = require('express');
const route = express.Router();
const loginController = require('../app/controllers/loginController');

route.get('/logout', loginController.logout);
route.post('/login', loginController.login);

module.exports = route