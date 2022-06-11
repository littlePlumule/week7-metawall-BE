const usersRouter = require('./users');
const postsRouter = require('./posts');
const uploadRouter = require( './upload');

module.exports = (app) => {
  app.use(usersRouter);
  app.use(postsRouter);
  app.use(uploadRouter)
}