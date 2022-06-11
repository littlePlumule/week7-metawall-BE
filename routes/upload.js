const express = require('express');
const router = express.Router();
const uploadControllers = require('../controllers/upload');
const handleErrorAsync = require('../service/handleErrorAsync');
const upload = require('../service/image');
const { isAuth } = require('../service/auth');

router.post('/upload', isAuth, upload, handleErrorAsync(uploadControllers.uploadImage));

module.exports = router;