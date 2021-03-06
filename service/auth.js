const jwt = require('jsonwebtoken');
const appError = require('../service/appError');
const handleErrorAsync = require('../service/handleErrorAsync');
const User = require('../models/users');

// 產生 JWT token
const generateSendJWT = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    user: {
      token,
      nickname: user.nickname
    }
  });
}

const isAuth = handleErrorAsync(async (req, res, next) => {
  // 確認 token 是否存在
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(appError(401, '你尚未登入！', next));
  }

  // 驗證 token 正確性
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      err
        ? reject(next(appError(401, 'token 驗證錯誤')))
        : resolve(payload)
    });
  });
  const currentUser = await User.findById(decoded.id);
  req.user = currentUser;
  next();
});

module.exports = {
  generateSendJWT,
  isAuth
}

