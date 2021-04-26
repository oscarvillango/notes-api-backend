const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

module.exports = {
  app,
  server,
  api
}
