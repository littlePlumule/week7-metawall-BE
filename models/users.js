const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: [true, '暱稱未填寫'],
  },
  gender: {
    type: String,
    enum:['male', 'female'],
    default: 'male',
    required: [true, '性別未填寫']
  },
  avatar: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    select: false,
    validate: {
      validator(value) {
        return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/.test(value);
      },
      message: '請輸入有效電子郵件',
    },
    required: [true, 'email 未填寫'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  }
}, {versionKey: false});

const User =  mongoose.model('user', userSchema);

module.exports = User;
