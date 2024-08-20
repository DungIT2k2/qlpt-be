const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Room = new Schema({
  name: { type: String, required: true },
  owner: { type: String },
  status: { type: String, required: true, enum: ['check', 'uncheck'] }
},
  { versionKey: false }
);

module.exports = mongoose.model('Room', Room);