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
    if(!post) return next(appError(400, '取得失敗, id 不匹配'));
    success(res, post);
  },

  async createdPost(req, res, next) {    
    const { content, author, image } = req.body;
    if(!content || !author) return next(appError(400, '新增失敗, 欄位未填寫完整'));
    const post = await Post.create({
      author,
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
    const isDelete = await Post.findByIdAndDelete(id);
    if(!isDelete) return next(appError(400, '刪除失敗, id 不匹配'));
    const allPosts = await Post.find();
    success(res, allPosts);
  },

  async updatePost(req, res, next) {    
    const id = req.params.id;
    const { image, content } = req.body;
    if(!image && !content) return next(appError(400, '請輸入要跟新的貼文或圖片'));
    const updatePost = await Post.findByIdAndUpdate(id, {
      image,
      content
    }, {new: true});
    if(!updatePost) return next(appError(400, '更新失敗, id 不匹配'));
    success(res, updatePost);
  },
}

module.exports = posts;
