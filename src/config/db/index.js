const mongoose = require('mongoose');
require('dotenv').config();

async function connect() {
  try {
    const srv = process.env.MONGODB_CONNECTION || 'mongodb://127.0.0.1:27017';
    const database = process.env.MONGODB_DATABASE || 'qlpt';
    await mongoose.connect(`${srv}/${database}`, {})
    .then((result)=>{
      console.log(`Connect Success DB: ${result.connections[0]._connectionString}`);
    });
  } catch (error) {
    console.log('Connect Fail DB!');
    console.error(error);
  }
}

module.exports = { connect };