const express = require('express');
const route = express.Router();
const PaymentController = require('../app/controllers/paymentController');
const router = require('.');

route.get('/create', PaymentController.create);
route.put('/pay', PaymentController.pay);
route.get('/print', PaymentController.print);
route.get('/', PaymentController.show);

module.exports = route;