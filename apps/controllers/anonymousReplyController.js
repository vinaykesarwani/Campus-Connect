 const AnonymousReply = require('../model/AnonymousReply');

exports.reply = async (req, res) => {
  try {
    const { postId } = req.params;
    const { sender, content } = req.body;

    if (!sender || !content) {
      return res.status(400).json({ msg: 'Sender and message are required.' });
    }

    const newReply = new AnonymousReply({
      sender,
      postId,
      message: content
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
    const replies = await AnonymousReply.find({ postId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 });
    res.status(200).json(replies);
    console.log(replies);
  } catch (error) {
    console.error('Error fetching replies:', error);
    res.status(500).json({ msg: 'Internal server error.' });
  }
};
