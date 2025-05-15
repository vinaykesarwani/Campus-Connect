const express = require('express');
const router = express.Router();
const { getBatches, getUsersByBatch } = require('../controllers/batchController');

router.get('/:id', getBatches);
router.get('/:id/:batch', getUsersByBatch);

module.exports = router;