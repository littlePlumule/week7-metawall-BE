const User = require('../models/users');
const { success, fail, notFound } = require('../service/response');

const users = {
  async getUsers(req, res) {
    const allUsers = await User.find();
    success(res, allUsers); 
  },

  async getUser(req, res) {
    try {
      const id = req.params.id;
      const user = await User.findById(id);
      if(user) {
        success(res, user);
      } else {
        fail(res, '取得失敗, id 不匹配');
      }
    } catch(error) {
      fail(res, error);
    }
  },

  async createdUser(req, res) {
    try {
      const { name, email, photo } = req.body;
      const newUser = await User.create({
        name,
        email,
        photo
      });
      success(res, newUser);
    } catch(error) {
      fail(res, error);
    }
  },

  async deleteUsers(req, res) {
    try {
      if(req.originalUrl == '/users/') {
        notFound(res);
      } else {
        await User.deleteMany({});
        const allUser = await User.find();
        success(res, allUser);
      }
    } catch(error) {
      fail(res, error);
    }
  },

  async deleteUser(req, res) {
    try {
      const id = req.params.id;
      const isDelete = await User.findByIdAndDelete(id);
      if(isDelete) {
        const allUser = await User.find();
        success(res, allUser);
      } else {
        fail(res, '刪除失敗, id 不匹配');
      }
    } catch(error) {
      fail(res, error);
    }
  },

  async updateUser(req, res) {
    try {
      const id = req.params.id;
      const { name, email, photo } = req.body;
      const updateUser = await User.findByIdAndUpdate(id, {
        name,
        email,
        photo
      }, {new: true});
      if(updateUser) {
        success(res, updateUser);
      } else {
        fail(res, '更新失敗, id 不匹配')
      }
    } catch(error) {
      fail(res, error);
    }
  },
}

module.exports = users;
