const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Ultility = new Schema({
    name: { type: String },
    month: { type: String },
    year: { type: String },
    electricity: { type: String },
    water: { type: String },
},
    { versionKey: false }
);

module.exports = mongoose.model('Ultility', Ultility);