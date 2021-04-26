const noteRouter = require('express').Router()
const Note = require('../models/Notes')
const User = require('../models/Users')

/* app.get('/', (req, resp) => {
  Note.find({})
    .then(notes => resp.json(notes))
}) */

noteRouter.get('/', async (req, resp) => {
  const notes = await Note.find({}).populate('user')
  resp.json(notes)
})

noteRouter.get('/:id', (req, resp, next) => {
  const { id } = req.params
  Note.findById(id)
    .then(note => {
      if (!note) {
        return resp.status(404).json({})
      }

      resp.json(note)
    })
    .catch(error => next(error))
})

noteRouter.delete('/:id', (req, resp, next) => {
  const { id } = req.params
  Note.findByIdAndDelete(id)
    .then(() => {
      resp.status(204).end()
    })
    .catch(error => next(error))
})

noteRouter.post('/', async (req, resp, next) => {
  const { content, important = false, user } = req.body

  if (!content || !user) {
    resp.status(400).send('Request incomplete')
  }

  const currentUser = await User.findById(user)
  const newNote = new Note({
    content,
    important,
    date: new Date(),
    user: currentUser._id
  })

  try {
    const response = await newNote.save()
    currentUser.notes = currentUser.notes.concat(response._id)
    await currentUser.save()

    resp.status(201).send(response)
  } catch (error) {
    next(error)
  }
})

noteRouter.put('/:id', (req, resp, next) => {
  const { id } = req.params
  const body = req.body

  if (!body || !body.content) {
    resp.status(400).send('Content required')
  }

  const noteUpdated = {
    content: body.content,
    important: body.important
  }

  Note.findByIdAndUpdate(id, noteUpdated, { new: true })
    .then(result => resp.json(result))
    .catch(err => next(err))
})

module.exports = noteRouter
