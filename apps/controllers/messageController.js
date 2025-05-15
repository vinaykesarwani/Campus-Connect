const Message = require('../model/Message');
const User = require('../model/User');

exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    const msg = new Message({ sender: senderId, receiver: receiverId, message });
    await msg.save();

    res.status(201).json({ msg: 'Message sent', message: msg });
  } catch (err) {
    res.status(500).json({ msg: 'Error sending message' });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ msg: 'Message not found' });
    res.json({ msg: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting message' });
  }
};

exports.updateMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const updated = await Message.findByIdAndUpdate(
      req.params.id,
      { message },
      { new: true }
    );
    if (!updated) return res.status(404).json({ msg: 'Message not found' });
    res.json({ msg: 'Message updated successfully', message: updated });
  } catch (err) {
    res.status(500).json({ msg: 'Error updating message' });
  }
};

exports.getMessageConnections = async (req, res) => {
  const { id } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: id },
        { receiver: id }
      ]
    });

    const userIds = new Set();

    messages.forEach(msg => {
      if (msg.sender.toString() !== id) userIds.add(msg.sender.toString());
      if (msg.receiver.toString() !== id) userIds.add(msg.receiver.toString());
    });

    const users = await User.find({ _id: { $in: Array.from(userIds) } }).select('name email');

    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: 'Failed to fetch connections' });
  }
};

exports.getConversation = async (req, res) => {
  const { userId, otherUserId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error('Error fetching conversation:', err);
    res.status(500).json({ msg: 'Failed to fetch messages' });
  }
};