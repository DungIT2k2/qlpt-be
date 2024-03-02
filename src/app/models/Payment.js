const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Payment = new Schema({
    name: {type: String},
    month: {type: String},
    year: {type: String},
    eNew: {type: String},
    wNew: {type: String},
    eOld: {type: String},
    wOld: {type: String},
    eConsumption: {type: String},
    wConsumption: {type: String},
    eTotal: {type: String},
    wTotal: {type: String},
    totalPay: {type: String},
    status: {type: String},

},
    { versionKey: false }
);

module.exports = mongoose.model('Payment', Payment);