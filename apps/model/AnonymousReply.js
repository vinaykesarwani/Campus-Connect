const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnonymousPost',
    required: true
  },
  message: {
    type: String,
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('AnonymousReply', replySchema);