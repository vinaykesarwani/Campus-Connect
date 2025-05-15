const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    college: String,
    batch: Number,
    company: String
});

module.exports = mongoose.model('User', userSchema);