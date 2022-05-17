const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '姓名未填寫'],
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
  photo: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  }
}, {versionKey: false});

const User =  mongoose.model('user', userSchema);

module.exports = User;
