const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/users');
const followControllers = require('../controllers/follow');
const handleErrorAsync = require('../service/handleErrorAsync');
const { isAuth } = require('../service/auth');
const { checkUserId } = require('../service/checkId');

// 註冊
router.post('/users/sign_up', handleErrorAsync(userControllers.signup));

// 登入
router.post('/users/sign_in', handleErrorAsync(userControllers.signin));

// 更改密碼
router.post('/users/updatePassword', isAuth, handleErrorAsync(userControllers.updatePassword));

// 取得個人資料
router.get('/users/profile', isAuth, handleErrorAsync(userControllers.getProfile));

// 修改個人資料
router.post('/users/profile', isAuth, handleErrorAsync(userControllers.updateProfile));

// 追蹤
router.post('/users/follows/:id', isAuth, checkUserId, handleErrorAsync(followControllers.postFollow));

// 取消追蹤
router.delete('/users/follows/:id', isAuth, checkUserId, handleErrorAsync(followControllers.deleteFollow));

// 取得所有用戶
router.get('/users', isAuth, handleErrorAsync(userControllers.getUsers));

// 取得單一用戶
router.get('/user/:id', isAuth, checkUserId, handleErrorAsync(userControllers.getUser));

// 新增用戶
router.post('/user', isAuth, handleErrorAsync(userControllers.createdUser));

// 刪除所有用戶
router.delete('/users', isAuth, handleErrorAsync(userControllers.deleteUsers));

// 刪除單一用戶
router.delete('/user/:id', isAuth, checkUserId, handleErrorAsync(userControllers.deleteUser));

// 更改用戶
router.patch('/user/:id', isAuth, checkUserId, handleErrorAsync(userControllers.updateUser));

module.exports = router;
