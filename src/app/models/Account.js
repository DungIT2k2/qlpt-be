const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const Account = new Schema({
    username: { type: String },
    password: { type: String },
    name: { type: String },
    role: { type: String },
    room: { type: String }
},
    { versionKey: false }

);

module.exports = mongoose.model('Account', Account);