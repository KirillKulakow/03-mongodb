const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../../config');

const UsersSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true, validate: { validator: function (v) {
        let valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return valid.test(v);
        }, message: props => `${props.value} is not a valid email!`, type: 'validation'}
    },
    password: { type: String, required: true, validate: { validator: function (v) {
        let valid = /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g;
        return valid.test(v);
        }, message: props => `${props.value} is not a valid password (one or more number, one or more letter - upper and lower, and one of special symbol, password length is more then 6 symbol)!`, type: 'validation'} },
    subscription: { type: String, enum: ["free", "pro", "premium"], default: "free"},
    token: { type: String }
});

UsersSchema.static('generateToken', function (userId) {
    const data = new Date();
    data.setHours(data.getHours() + 1);
    return jwt.sign({_id: userId, expiresIn: data}, config.secretKey, {expiresIn: "1h"})
})

UsersSchema.static('decodeToken', function (token) {
    return jwt.decode(token, {complete: true})
})

UsersSchema.static("isPasswordValid", async function(password, userToken) {
    return bcrypt.compare(password, userToken);
});

exports.UserModel = mongoose.model('User', UsersSchema)