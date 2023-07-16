const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN, {
      dbName: 'technical-test'
    });
    console.log('DB Online')
  } catch (error) {
    console.log(error);
    throw new Error('Error while connecting to DB', error);
  }
}


module.exports = {
  dbConnection
}