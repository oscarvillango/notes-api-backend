const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/Users')

userRouter.get('/', async (req, resp) => {
  const users = await User.find({}).populate('notes', {
    content: 1,
    date: 1,
    important: 1
  })
  resp.json(users)
})

userRouter.post('/', async (req, resp) => {
  const { username, name, password } = req.body

  const passwordHash = await bcrypt.hash(password, 10)
  try {
    const newUser = new User({
      username,
      name,
      passwordHash
    })

    const response = await newUser.save()
    resp.status(201).json(response)
  } catch (error) {
    resp.status(409).json(error)
  }
})

module.exports = userRouter
