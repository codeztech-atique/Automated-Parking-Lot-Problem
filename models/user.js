const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userschema = new mongoose.Schema({
  user: {
    type: String
  },
  password: {
    type: String
  },
  firstname: {
    type: String
  },
  lastname: {
    type: String
  }
});

var User = mongoose.model('User', userschema);
module.exports = User;
