const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/users');
const handleErrorAsync = require('../service/handleErrorAsync');

router.get('/users', handleErrorAsync(userControllers.getUsers));

router.get('/user/:id', handleErrorAsync(userControllers.getUser));

router.post('/user', handleErrorAsync(userControllers.createdUser));

router.delete('/users', handleErrorAsync(userControllers.deleteUsers));

router.delete('/user/:id', handleErrorAsync(userControllers.deleteUser));

router.patch('/user/:id', handleErrorAsync(userControllers.updateUser));

module.exports = router;
