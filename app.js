const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

const app = express();

require('./connections');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(postsRouter);
app.use(usersRouter);

app.use(function(req, res, next) {
  res.status(404).send({
    status: 'fail',
    message: '無此路由'
  })
});

app.use(function(req, res, next) {
  res.status(500).send({
    status: 'fail',
    message: '系統錯誤，請洽系統管理員'
  })
});

module.exports = app;
