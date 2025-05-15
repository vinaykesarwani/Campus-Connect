const express = require('express');
const router = express.Router();
const { sendMessage, deleteMessage, updateMessage, getMessageConnections, getConversation } = require('../controllers/messageController');

router.post('/send', sendMessage);
router.delete('/:id', deleteMessage);
router.put('/:id', updateMessage); 
router.get('/:id', getMessageConnections); 
router.get('/:userId/:otherUserId', getConversation);

module.exports = router;