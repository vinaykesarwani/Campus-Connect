const express = require('express');
const router = express.Router();
const { reply, getReply } = require('../controllers/replyController');

router.post('/:postId', reply);
router.get('/:postId', getReply);

module.exports = router;