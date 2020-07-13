const mongoose = require('mongoose');

const ContactsSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    subscription: { type: String, default: "free" },
    password: { type: String, required: true },
    token: { type: String, default: "" },
});

exports.ContactModel = mongoose.model('Contact', ContactsSchema)