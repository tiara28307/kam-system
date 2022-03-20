const mongoose = require('mongoose');

const closeConnection = () => {
  return mongoose.disconnect()
    .then(() => {
      return true
    })
    .catch((err) => {
      console.error('Close db connection error: ', err)
      return false
    })
}

module.exports = closeConnection;