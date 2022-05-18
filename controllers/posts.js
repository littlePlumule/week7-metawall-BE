const Post = require('../models/posts');
const { success, fail, notFound } = require('../service/response')

const posts = {
  async getPosts(req, res) {
    try {
      const sort = req.query.sort === 'asc' ? 'createdAt' : '-createdAt' 
      const q = req.query.q !== undefined ? {content: new RegExp(req.query.q)} : {};
      const limit = req.query.limit
      const allPosts = await Post.find(q).populate({
        path: 'user',
        select: 'name photo'
      }).sort(sort).limit(limit);
      success(res, allPosts);
    } catch(error) {
      fail(res, error);
    }
  },

  async getPost(req, res) {
    try {
      const id = req.params.id;
      const post = await Post.findById(id).populate({
        path: 'user',
        select: 'name photo'
      });
      if(post) {
        success(res, post);
      } else {
        fail(res, '取得失敗, id 不匹配');
      }
    } catch(error) {
      fail(res, error)
    }
  },

  async createdPost(req, res) {
    try {
      const { content, user, image } = req.body;
      if(content && user) {
        await Post.create({
          user,
          content,
          image,
        })
        const post = await Post.find().populate({
          path: 'user',
          select: 'name photo'
        })
        success(res, post);
      } else {
        fail(res, '新增失敗, 欄位未填寫完整');
      }
    } catch(error) { 
      fail(res, error)
    }
  },

  async deletePosts(req, res) {
    try {
      if(req.originalUrl == '/posts/') {
        notFound(res);
      } else {
        await Post.deleteMany({});
        const allPosts = await Post.find();
        success(res, allPosts)
      }      
    } catch(error) {
      fail(res, error);
    }
  },

  async deletePost(req, res) {
    try {
      const id = req.params.id;
      const isDelete = await Post.findByIdAndDelete(id);
      if(isDelete) {
        const allPosts = await Post.find();
        success(res, allPosts);
      } else {
        fail(res, '刪除失敗, id 不匹配');
      }
    } catch(error) {
      fail(res, error);
    }
  },

  async updatePost(req, res) {
    try {
      const id = req.params.id;
      const { image, content } = req.body;
      const updatePost = await Post.findByIdAndUpdate(id, {
        image,
        content
      }, {new: true});
      if(updatePost) {
        success(res, updatePost);
      } else {
        fail(res, '更新失敗, id 不匹配');
      }
    } catch(error) {
      fail(res, error);
    }
  },
}

module.exports = posts;
