const express = require('express');
const router = express.Router();
const homeController = require('../app/controllers/HomeController');
const verifyToken = require('../app/middlewares/veryfyToken');

router.get('/', verifyToken, homeController.index);

module.exports = router;