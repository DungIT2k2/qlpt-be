const express = require('express');
const route = express.Router();
const userController = require('../app/controllers/userController');
const verifyToken = require('../app/middlewares/veryfyToken');

route.get('/checkpayment', verifyToken, userController.check)
route.get('/',verifyToken ,userController.index);

module.exports = route