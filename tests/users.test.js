const mongoose = require('mongoose')
const { api, server } = require('./utils')
const User = require('../models/Users')

describe.only('POST users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('when the data is correct', async () => {
    const newUser = {
      username: 'testing',
      name: 'tester',
      password: '1234'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const currentUsers = await User.find({})
    const usernames = currentUsers.map(u => u.username)

    expect(usernames).toContain(newUser.username)
  })

  afterAll(() => {
    mongoose.connection.close()
    server.close()
  })
})
