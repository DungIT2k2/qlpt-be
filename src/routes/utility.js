const express = require('express');
const router = express.Router();
const UtilityController = require('../app/controllers/utilityController');

router.post('/create', UtilityController.create);
router.put('/update', UtilityController.update);
router.get('/', UtilityController.getList);

module.exports = router;