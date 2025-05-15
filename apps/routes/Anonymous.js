const express = require('express');
const router = express.Router();
const { createPost, getAllPost} = require('../controllers/anonymousController');

router.post('/create', createPost);
router.get('/users/:id', getAllPost);

module.exports = router;