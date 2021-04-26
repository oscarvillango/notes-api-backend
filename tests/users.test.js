const mongoose = require('mongoose')
const { api, server } = require('./utils')
const User = require('../models/Users')

const initialUser = {
  username: 'initial',
  name: 'initial',
  password: '1234'
}

describe.only('POST users', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const newUser = new User(initialUser)
    await newUser.save()
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

  test('avoid to insert a repeted user', async () => {
    const result = await api
      .post('/api/users')
      .send(initialUser)
      .expect(409)
      .expect('Content-Type', /application\/json/)

    expect(result.body.errors.username.message).toContain('`username` to be unique')
  })

  afterAll(() => {
    mongoose.connection.close()
    server.close()
  })
})
