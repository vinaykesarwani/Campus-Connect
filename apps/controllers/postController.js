const Post = require('../model/Post');
const User = require('../model/User');


exports.createPost = async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    const post = new Post({ title, content, createdBy: userId });
    await post.save();

    res.status(201).json({ msg: 'Post created successfully', post });
  } catch (err) {
    res.status(500).json({ msg: 'Error creating post' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json({ msg: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting post' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json({ msg: 'Post updated successfully', post });
  } catch (err) {
    res.status(500).json({ msg: 'Error updating post' });
  }
};

exports.getAllPost= async (req, res) => {
  const { id } = req.params;

  try {
    const currentUser = await User.findById(id);
    if (!currentUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const userCollege = currentUser.college;

    const usersInCollege = await User.find({ college: userCollege }).select('_id');
    const userIds = usersInCollege.map(user => user._id);

    const posts = await Post.find({ createdBy: { $in: userIds } })
      .populate('createdBy', 'name email college')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to fetch posts by college' });
  }
};

exports.getPost = async (req, res) => {
  const id  = req.params.id;

  try {
    const posts = await Post.find({createdBy: id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch user posts' });
  }
};