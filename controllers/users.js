const User = require('../models/users');
const { success } = require('../service/response');
const appError = require('../service/appError');

const users = {
  async getUsers(req, res) {
    const allUsers = await User.find();
    success(res, allUsers); 
  },

  async getUser(req, res, next) {
    const id = req.params.id;
    const user = await User.findById(id);
    if(!user) return next(appError(400, '取得失敗, id 不匹配'));
    success(res, user);
  },

  async createdUser(req, res) {
    const { nickname, email, avatar, gender } = req.body;
    const newUser = await User.create({
      nickname,
      email,
      avatar,
      gender
    });
    success(res, newUser);
  },

  async deleteUsers(req, res, next) {
    if(req.originalUrl == '/users/') {
      return next(appError(404, '無此路徑'));
    } else {
      await User.deleteMany({});
      const allUser = await User.find();
      success(res, allUser);
    }
  },

  async deleteUser(req, res, next) {
    const id = req.params.id;
    const isDelete = await User.findByIdAndDelete(id);
    if(!isDelete) return next(appError(400, '刪除失敗, id 不匹配'));
    const allUser = await User.find();
    success(res, allUser);
  },

  async updateUser(req, res, next) {
    const id = req.params.id;
    const { nickname, avatar, gender } = req.body;
    const updateUser = await User.findByIdAndUpdate(id, {
      nickname,
      avatar,
      gender
    }, {new: true});
    if(!updateUser) return next(appError(400, '更新失敗, id 不匹配'));
    success(res, updateUser);
  },
}

module.exports = users;
