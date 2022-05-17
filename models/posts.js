const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: [true, '貼文 ID 未填寫'],
  },
  image: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    required: [true, '貼文內容未填寫'],
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  }
}, {versionKey: false});

const Post = mongoose.model('post', postsSchema);

module.exports = Post;
