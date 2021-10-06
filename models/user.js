const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userId  : Number,
  name: String,
  password: String,
  email: String,
  role: String
});

module.exports = mongoose.model('User', UserSchema);
