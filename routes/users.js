const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/users');

router.get('/users', userControllers.getUsers);

router.get('/user/:id', userControllers.getUser);

router.post('/user', userControllers.createdUser);

router.delete('/users', userControllers.deleteUsers);

router.delete('/user/:id', userControllers.deleteUser);

router.patch('/user/:id', userControllers.updateUser);

module.exports = router;
