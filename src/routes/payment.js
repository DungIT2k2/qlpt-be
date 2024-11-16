const express = require('express');
const route = express.Router();
const PaymentController = require('../app/controllers/paymentController');

route.post('/pay', PaymentController.pay);
route.post('/calculate', async (req, res) => { await PaymentController.calManual(req, res); });
route.get('/', PaymentController.get);

module.exports = route;