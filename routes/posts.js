const express = require('express');
const router = express.Router();
const postsControllers = require('../controllers/posts');

router.get('/posts', postsControllers.getPosts);

router.get('/post/:id', postsControllers.getPost);

router.post('/post', postsControllers.createdPost);

router.delete('/posts', postsControllers.deletePosts);

router.delete('/post/:id', postsControllers.deletePost);

router.patch('/post/:id', postsControllers.updatePost);

module.exports = router;
