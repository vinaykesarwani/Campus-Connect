const AnonymousPost = require('../model/AnonymousPost');
const User = require('../model/User');


exports.createPost = async (req, res) => {
  try {
    const { title, content, college } = req.body;
    console.log(req.body);

    const anonymousPost = new AnonymousPost({ title, content, college});
    await anonymousPost.save();

    res.status(201).json({ msg: 'Post created successfully', anonymousPost });
  } catch (err) {
    res.status(500).json({ msg: 'Error creating post' });
  }
};

exports.getAllPost = async (req, res) => {
  const { id } = req.params;

  try {
    const currentUser = await User.findById(id);
    console.log()
    if (!currentUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const userCollege = currentUser.college;
    const posts = await AnonymousPost.find({ college: userCollege })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to fetch anonymous posts' });
  }
};
