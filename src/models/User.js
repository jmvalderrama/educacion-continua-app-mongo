const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  document_id: {
    type: Number,
    required: true
  },
  phone: {
    type: Number,
    required: true,
    trim: true
  },
  mail: {
    type: String,
    required: true
  },
  role_type: {
    type: String,
    default: 'candidate'
  }
});

UserSchema.plugin(timestamp);

const User = mongoose.model('User', UserSchema);

module.exports = User;
