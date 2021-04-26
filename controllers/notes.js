const noteRouter = require('express').Router()
const Note = require('../models/Notes')

/* app.get('/', (req, resp) => {
  Note.find({})
    .then(notes => resp.json(notes))
}) */

noteRouter.get('/', async (req, resp) => {
  const notes = await Note.find({})
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

noteRouter.post('/', (req, resp, next) => {
  const body = req.body

  if (!body || !body.content) {
    resp.status(400).send('Content required')
  }

  const newNote = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

  newNote.save()
    .then(response => resp.status(201).send(response))
    .catch(next)
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
