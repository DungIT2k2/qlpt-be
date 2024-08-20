const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Utility = new Schema({
    name: { type: String, required: true },
    month: { type: String, required: true },
    year: { type: String, required: true },
    electricity: { type: String },
    water: { type: String },
},
    { versionKey: false }
);

module.exports = mongoose.model('Utility', Utility);