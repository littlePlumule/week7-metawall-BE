module.exports = {
  success(res, data) {
    res.send({
      status: 'success',
      data
    })
  },
  
  fail(res, message) {
    res.status(400).send({
      status: 'fail',
      message
    })
  },

  notFound(res) {
    res.status(404).send({
      status: 'fail',
      message: '無此路由'
    })
  }
}