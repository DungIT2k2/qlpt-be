const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const Account = new Schema({
    username: { type: String, required: true },
    password: { type: String },
    name: { type: String, required: true },
    role: { type: String, required: true, enum: ['User', 'Manage'] },
    room: { type: String }
},
    { versionKey: false }
);

module.exports = mongoose.model('Account', Account);