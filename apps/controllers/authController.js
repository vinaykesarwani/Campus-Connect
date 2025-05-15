const User = require('../model/User');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, college, batch, company} = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ msg: 'Email already exists' });

    const user = new User({ name, email, password, college, batch, company });
    await user.save();
    res.status(200).json({ userId: user._id, name: user.name, email: user.email });
    
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    if (user.password !== password) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    res.status(200).json({ userId: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.fetch = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ msg: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ msg: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};