const express = require("express");
const route = express.Router();
const userController = require("../app/controllers/userController");
const { verifyToken } = require("../app/middlewares/auth");

route.get("/checkpayment", userController.check);
route.get("/", userController.index);

module.exports = route;
