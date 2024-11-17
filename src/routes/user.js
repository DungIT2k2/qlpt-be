const express = require("express");
const route = express.Router();
const userController = require("../app/controllers/userController");

route.post("/checkpayment", userController.checkPayment);
route.get("/", userController.get);

module.exports = route;
