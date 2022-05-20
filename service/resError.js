const resError = {
  // Dev show Error
  resErrorDev(err, res) {
    res.status(err.statusCode).send({
      message: err.message,
      name: err.name,
      error: err,
      stack: err.stack
    });
  },
  // express error handle
  // Prod show Error 自己設定的 err 錯誤 
  resErrorProd(err, res) {
    if (err.isOperational) {
      res.status(err.statusCode).send({
        message: err.message
      });
    } else {
      // log 紀錄
      console.error('出現重大錯誤', err);
      // 送出罐頭預設訊息
      res.status(500).send({
        status: 'error',
        message: '系統錯誤，請恰系統管理員'
      });
    }
  },
}
module.exports = resError;
