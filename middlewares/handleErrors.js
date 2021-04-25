module.exports = (error, request, response, next) => {
  if (error.name === 'CastError') {
    response.status(400).send({ error: 'Request is malformed' })
  }
  response.status(500).end()
}
