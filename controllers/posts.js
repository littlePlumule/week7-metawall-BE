const Post = require('../models/posts');
const { success } = require('../service/response');
const appError = require('../service/appError');

const posts = {
  async getPosts(req, res) {
    const sort = req.query.sort === 'asc' ? 'createdAt' : '-createdAt' 
    const q = req.query.q !== undefined ? {content: new RegExp(req.query.q)} : {};
    const limit = req.query.limit
    const allPosts = await Post.find(q).populate({
      path: 'author',
      select: 'nickname avatar'
    }).sort(sort).limit(limit);
    success(res, allPosts);  
  },

  async getPost(req, res, next) {
    const id = req.params.id;
    const post = await Post.findById(id).populate({
      path: 'author',
      select: 'nickname avatar'
    });
    success(res, post);
  },

  async createdPost(req, res, next) {    
    const { user, body: {content, image}} = req;
    if(!content || content.trim().length === 0) return next(appError(400, '欄位未填寫完整'));
    const post = await Post.create({
      author: user,
      content,
      image,
    })
    success(res, post);
  },

  async deletePosts(req, res, next) {    
    if(req.originalUrl == '/posts/') return next(appError(404, '無此路由'));
    await Post.deleteMany({});
    const allPosts = await Post.find();
    success(res, allPosts)
  },

  async deletePost(req, res, next) {    
    const id = req.params.id;
    const userId = req.user.id
    const post = await Post.findById(id)
    if (post.author.toString() !== userId) {
      return next(appError(400, '使用者不同, 無此權限'));
    }
    const isDelete = await Post.findByIdAndDelete(id);
    const allPosts = await Post.find();
    success(res, allPosts);
  },

  async updatePost(req, res, next) {    
    const userId = req.user.id
    const id = req.params.id;
    const { image, content } = req.body;
    if(!image && !content) return next(appError(400, '請輸入要跟新的貼文或圖片'));
    const post = await Post.findById(id)
    if (post.author.toString() !== userId) {
      return next(appError(400, '使用者不同, 無此權限'));
    }
    const updatePost = await Post.findByIdAndUpdate(id, {
      image,
      content
    }, { new: true, runValidators: true });
    success(res, updatePost);
  },
}

module.exports = posts;
