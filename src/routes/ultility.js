const express = require('express');
const router = express.Router();
const UltilityController = require('../app/controllers/ultilityController');

router.get('/add', UltilityController.add);
router.post('/save', UltilityController.save);
router.get('/edit', UltilityController.edit);
router.put('/update', UltilityController.update);
router.get('/', UltilityController.show);

module.exports = router;