const express = require('express');
const router = express.Router();
const postsControllers = require('../controllers/posts');
const handleErrorAsync = require('../service/handleErrorAsync');

router.get('/posts', handleErrorAsync(postsControllers.getPosts));

router.get('/post/:id', handleErrorAsync(postsControllers.getPost));

router.post('/post', handleErrorAsync(postsControllers.createdPost));

router.delete('/posts', handleErrorAsync(postsControllers.deletePosts));

router.delete('/post/:id', handleErrorAsync(postsControllers.deletePost));

router.patch('/post/:id', handleErrorAsync(postsControllers.updatePost));

module.exports = router;
