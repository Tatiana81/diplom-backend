// models/user.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator(v) {
        return /[A-Za-z0-9]+@[A-Za-z0-9]+\.[a-z]{2,}/.test(v);
      },
      message: (props) => `${props.value} некорректный адрес электронной почты!`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
