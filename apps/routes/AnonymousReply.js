const express = require('express');
const router = express.Router();
const { reply, getReply } = require('../controllers/anonymousReplyController.js');

router.post('/:postId', reply);
router.get('/:postId', getReply);

module.exports = router;