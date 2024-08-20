const express = require('express');
const route = express.Router();
const accountController = require('../app/controllers/accountController');

route.post('/create', accountController.create);
route.delete('/delete', accountController.delete);
route.get('/', accountController.show);

module.exports = route;