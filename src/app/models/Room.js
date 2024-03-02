const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Room = new Schema({
    name: {type: String},
    owner: {type: String},
    status: {type: String}
  },
    { versionKey: false }
  );

module.exports = mongoose.model('Room', Room);