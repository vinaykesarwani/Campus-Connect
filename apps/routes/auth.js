const express = require('express');
const router = express.Router();
const { signup, login, fetch, getProfile } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.get('', fetch);
router.get('/:id', getProfile);


module.exports = router;