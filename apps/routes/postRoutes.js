const express = require('express');
const router = express.Router();
const { createPost, deletePost, updatePost , getPost, getAllPost} = require('../controllers/postController');

router.post('/create', createPost);
router.delete('/:id', deletePost);
router.put('/:id', updatePost);
router.get('/users/:id', getAllPost);
router.get('/:id', getPost);

module.exports = router;