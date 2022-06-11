const sizeOf = require('image-size');
const { ImgurClient } = require('imgur');
const response = require('../service/response');
const appError = require('../service/appError');

const upload = {
  async uploadImage(req, res, next) {
    const { files } = req;
    if(!files.length) {
      return next(appError(400, '尚未上傳圖片'));
    }
    const dimensions = sizeOf(req.files[0].buffer);
    if(dimensions.width !== dimensions.height) {
      return next(appError(400, '圖片長寬不是 1:1 的尺寸'));
    }
    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENTID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    });

    // 轉 base64
    const { data, status, success } = await client.upload({
      image: files[0].buffer.toString('base64'),
      type: 'base64',
      album: process.env.IMGUR_ALBUM_ID
    });

    if (success) {
      response.success(res, data.link)
    } else {
      return next(appError(status, '發生錯誤，請稍後再試'))
    }
  },
}

module.exports = upload
