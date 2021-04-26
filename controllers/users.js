const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/Users')

userRouter.post('/', async (req, resp) => {
  const { username, name, password } = req.body

  const passwordHash = await bcrypt.hash(password, 10)
  const newUser = new User({
    username,
    name,
    passwordHash
  })

  const response = await newUser.save()
  resp.status(201).json(response)
})

module.exports = userRouter
