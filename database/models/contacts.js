const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ContactsSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    subscription: { type: String, default: "free" },
    password: { type: String, required: true },
    token: { type: String, default: "" },
});

ContactsSchema.plugin(mongoosePaginate);

exports.ContactModel = mongoose.model('Contact', ContactsSchema)