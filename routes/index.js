const usersRouter = require('./users');
const postsRouter = require('./posts');

module.exports = (app) => {
  app.use(usersRouter);
  app.use(postsRouter);
}