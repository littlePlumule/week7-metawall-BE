const express = require('express');
const router = express.Router();
const postsControllers = require('../controllers/posts');
const handleErrorAsync = require('../service/handleErrorAsync');
const { isAuth } = require('../service/auth');
const { checkPostId } = require('../service/checkId');

// 取得所有貼文
router.get('/posts', isAuth, handleErrorAsync(postsControllers.getPosts));

// 取得單一貼文
router.get('/post/:id', isAuth, checkPostId, handleErrorAsync(postsControllers.getPost));

// 新增貼文
router.post('/post', isAuth, handleErrorAsync(postsControllers.createdPost));

// 刪除所有貼文
router.delete('/posts', isAuth, handleErrorAsync(postsControllers.deletePosts));

// 刪除單一貼文
router.delete('/post/:id', isAuth, checkPostId, handleErrorAsync(postsControllers.deletePost));

// 修改貼文
router.patch('/post/:id', isAuth, checkPostId, handleErrorAsync(postsControllers.updatePost));

module.exports = router;
