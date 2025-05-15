const User = require('../model/User');

exports.getBatches = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = await User.findById(id);
    if (!currentUser) return res.status(404).json({ msg: 'User not found' });

    const batches = await User.distinct('batch', { college: currentUser.college });
    res.json(batches.sort((a, b) => b - a));
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching batches' });
  }
};

exports.getUsersByBatch = async (req, res) => {
  try {
    const { batch, id } = req.params;

    const currentUser = await User.findById(id);
    if (!currentUser) return res.status(404).json({ msg: 'User not found' });

    const users = await User.find({
      batch,
      college: currentUser.college
    }).select('name email college company');

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching users for batch' });
  }
};