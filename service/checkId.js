const mongoose = require('mongoose');
const appError = require('../service/appError');
const User = require('../models/users');
const Post = require('../models/posts');

const checkUserId = async (req, res, next) => {
  const { id } = req.params;
  const isValidId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidId) {
    return next(appError(400, '使用者 ID 格式錯誤, 請重新確認'))
  }
  const user = await User.findById(id);
  if (!user) {
    return next(appError(400, '無此用戶'))
  }
  next()
}

const checkPostId = async (req, res, next) => {
  const { id } = req.params;
  const isValidId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidId) {
    return next(appError(400, '貼文 ID 格式錯誤, 請重新確認'))
  }
  const post = await Post.findById(id);
  if (!post) {
    return next(appError(400, '無此篇貼文'))
  }
}

module.exports = { checkUserId, checkPostId };