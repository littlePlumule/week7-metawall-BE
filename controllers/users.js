const validator = require('validator');
const bcrypt = require('bcryptjs');
const { generateSendJWT } = require('../service/auth');
const User = require('../models/users');
const { success } = require('../service/response');
const appError = require('../service/appError');

const users = {
  async signup(req, res, next) {
    let { email, password, confirmPassword, nickname } = req.body;
    // 內容不可為空
    if (!email || !password || !confirmPassword || !nickname) {
      return next(appError(400, "欄位未填寫正確！"));
    }
    // 暱稱至少 2 個字以上
    if (nickname.length < 2) {
      return next(appError(400, "暱稱至少 2 個字以上"))
    }
    // 密碼不一致！
    if (password !== confirmPassword) {
      return next(appError(400, "密碼不一致！"));
    }
    // 密碼 8 碼以上, 英數混合
    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minUppercase: 0,
      minSymbols: 0,
    })) {
      return next(appError(400, "密碼需至少 8 碼以上，並英數混合"));
    }
    // 是否為 Email
    if (!validator.isEmail(email)) {
      return next(appError(400, "Email 格式不正確"));
    }

    // 加密密碼
    password = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email,
      password,
      nickname
    });
    generateSendJWT(newUser, 201, res);
  },

  async signin(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(appError(400, '帳號密碼不可為空'));
    }
    if (!validator.isEmail(email)) {
      return next(appError(400, "Email 格式不正確"));
    }
    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minUppercase: 0,
      minSymbols: 0,
    })) {
      return next(appError(400, "密碼需至少 8 碼以上，並英數混合"));
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(appError(400, '無此用戶'))
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return next(appError(400, '您的密碼不正確'));
    }
    generateSendJWT(user, 200, res);
  },

  async updatePassword(req, res, next) {
    const { user, body: { password, confirmPassword } } = req;

    if (!password || !confirmPassword) {
      return next(appError(400, '填寫不完整'));
    }

    if (password !== confirmPassword) {
      return next(appError(400, '密碼不一致'));
    }

    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minUppercase: 0,
      minSymbols: 0,
    })) {
      return next(appError(400, "密碼需至少 8 碼以上，並英數混合"));
    }

    const newPassword = await bcrypt.hash(password, 12);

    await User.updateOne({ _id: user._id }, { password: newPassword });
    success(res, '更新密碼成功')
  },

  async getProfile(req, res) {
    const { user } = req;
    const profile = await User.findById(user._id)
    success(res, profile);
  },

  async updateProfile(req, res, next) {
    const { user, body: { nickname, gender, avatar } } = req;
    if (!nickname || nickname.trim().length === 0) {
      return next(appError(400, '請填寫暱稱'))
    }
    if (nickname.length < 2) {
      return next(appError(400, "暱稱至少 2 個字以上"))
    }
    const profile = await User.findByIdAndUpdate(user.id, { nickname, gender, avatar }, { new: true, runValidators: true });
    success(res, profile);
  },

  async getUsers(req, res) {
    const allUsers = await User.find();
    success(res, allUsers);
  },

  async getUser(req, res, next) {
    const id = req.params.id;
    const user = await User.findById(id);
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
    if (req.originalUrl == '/users/') {
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
    }, { new: true, runValidators: true });
    success(res, updateUser);
  },
}

module.exports = users;
