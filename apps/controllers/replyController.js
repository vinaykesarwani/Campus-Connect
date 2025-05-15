 const Reply = require('../model/Reply');

exports.reply = async (req, res) => {
  try {
    const { postId } = req.params;
    const { sender, message } = req.body;

    if (!sender || !message) {
      return res.status(400).json({ msg: 'Sender and message are required.' });
    }

    const newReply = new Reply({
      sender,
      postId,
      message
    });

    await newReply.save();
    res.status(201).json({ msg: 'Reply posted successfully.', reply: newReply });
  } catch (error) {
    console.error('Error creating reply:', error);
    res.status(500).json({ msg: 'Internal server error.' });
  }
};

exports.getReply = async (req, res) => {
  try {
    const { postId } = req.params;

    const replies = await Reply.find({ postId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 });

    res.status(200).json({ replies });
  } catch (error) {
    console.error('Error fetching replies:', error);
    res.status(500).json({ msg: 'Internal server error.' });
  }
};
