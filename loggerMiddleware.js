const logger = (req, resp, next) => {
  console.log(req.path)
  console.log(req.body)
  console.log('/*-------------------*/')
  next()
}

module.exports = logger
