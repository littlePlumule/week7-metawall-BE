const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const { resErrorProd, resErrorDev } = require('./service/resError');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

const app = express();

// 程式出現重大錯誤時
process.on('uncaughtException', err => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error('Uncaughted Exception！')
  console.error(err);
  process.exit(1);
});

require('./connections');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./routes')(app);

// Error: router 404 
app.use(function (req, res, next) {
  res.status(404).send({
    status: 'fail',
    message: '無此路由'
  })
});

// error handler Middleware
app.use(function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;

  // dev
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res);
  }

  // production
  if (err.name === 'ValidationError') {
    err.message = "資料欄位未填寫正確，請重新輸入！"
    err.statusCode = 400
    err.isOperational = true;
    return resErrorProd(err, res)
  }

  if (err.name === 'CastError') {
    err.message = '無此 ID 請重新確認!';
    err.statusCode = 400;
    err.isOperational = true;
    return resErrorProd(err, res);
  }

  if (err.name === 'SyntaxError') {
    err.message = '格式錯誤, 請重新確認!';
    err.statusCode = 400;
    err.isOperational = true;
    return resErrorProd(err, res);
  }

  if (err.code === 11000) {
    err.message = 'Email 已使用, 請重新註冊!'
    err.statusCode = 400
    err.isOperational = true;
    return resErrorProd(err, res);
  }
  resErrorProd(err, res)
});

// 未捕捉到的 catch 
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的 rejection：', promise);
  console.error('原因：', err);
});

module.exports = app;
