const mongoose = require('mongoose')
const { server, api } = require('./utils')
const Note = require('../models/Notes')

const initialNotes = [
  {
    content: 'Interesante que es MongoDB',
    date: new Date(),
    important: true
  },
  {
    content: 'Creating a PUT',
    important: true,
    date: new Date()
  }
]

beforeEach(async () => {
  await Note.deleteMany({})

  const notesModels = initialNotes.map((note) => new Note(note))
  await Note.collection.insertMany(notesModels)
})

describe('GET all', () => {
  test('notes status and content-type', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('collection have 2 notes', async () => {
    const notes = await api.get('/api/notes')

    expect(notes.body).toHaveLength(initialNotes.length)
  })

  test('collection contains at list word MongoDB', async () => {
    const response = await api.get('/api/notes')
    const contentNotes = response.body.map(note => note.content)
    expect(contentNotes).toContain('Interesante que es MongoDB')
  })
})

describe('POST Notes', () => {
  test('When the new note has all nedded', async () => {
    const newNote = {
      content: 'Soy una nota de prueba',
      important: false
    }

    api
      .post('/api/notes')
      .send(newNote)
      .expect(201) // TODO: Research why it accepts any status code
      .expect('Content-Type', /application\/json/)
  })

  test('When the api avoids to insert a wrong note', async () => {
    const newNote = {
      important: false
    }

    api
      .post('/api/notes')
      .send(newNote)
      .expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
