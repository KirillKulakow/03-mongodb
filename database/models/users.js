const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../../config');

const UsersSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatarURL: { type: String },
    subscription: { type: String, enum: ["free", "pro", "premium"], default: "free"},
    token: { type: String }
});

UsersSchema.static('generateToken', function (userId) {
    const data = new Date();
    data.setHours(data.getUTCHours() + 1);
    return jwt.sign({_id: userId, expiresIn: data}, config.secretKey, {expiresIn: "1h"})
})

UsersSchema.static('decodeToken', function (token) {
    return jwt.decode(token, {complete: true})
})

UsersSchema.static("isPasswordValid", async function(password, userToken) {
    return bcrypt.compare(password, userToken);
});

exports.UserModel = mongoose.model('User', UsersSchema)