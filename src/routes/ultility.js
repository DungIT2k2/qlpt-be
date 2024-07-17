const express = require('express');
const router = express.Router();
const UltilityController = require('../app/controllers/ultilityController');
const { authAdmin } = require('../app/middlewares/auth');

router.get('/add', authAdmin, UltilityController.add);
router.post('/save', authAdmin,  UltilityController.save);
router.get('/edit', authAdmin, UltilityController.edit);
router.put('/update', authAdmin, UltilityController.update);
router.get('/', authAdmin, UltilityController.show);

module.exports = router;