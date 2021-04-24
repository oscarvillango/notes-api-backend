const express = require('express')
const cors = require('cors')
const logger = require('./loggerMiddleware')
const app = express()

app.use(cors())
app.use(express.json())
app.use(logger)

/* const app = http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end("Hola Mundo!!");
}); */

let notes = [
  {
    id: 1,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
    date: '2020-02-04T17:56:00',
    important: true
  },
  {
    id: 2,
    content: 'LUt tincidunt placerat orci ut sodales.',
    date: '2021-02-04T17:56:00',
    important: false
  },
  {
    id: 3,
    content: 'Etiam aliquet aliquam elit, id maximus nibh euismod in.',
    date: '2012-02-04T17:56:00',
    important: false
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hola Mundo</h1>')
})

app.get('/api/notes', (req, resp) => {
  resp.json(notes)
})

app.get('/api/notes/:id', (req, resp) => {
  const { id } = req.params
  const note = notes.find(note => note.id === id)

  if (!note) {
    return resp.status(404).json({})
  }

  resp.json(note)
})

app.delete('/api/notes/:id', (req, resp) => {
  const { id } = req.params
  notes = notes.filter(note => note.id !== id)
  resp.status(204).end()
})

app.post('/api/notes', (req, resp) => {
  const body = req.body

  if (!body || !body.content) {
    resp.status(400).send('Content required')
  }

  const ids = notes.map(note => note.id)

  const newNote = {
    id: Math.max(...ids) + 1,
    content: body.content,
    important: typeof body.important !== 'undefined' ? body.important : false,
    date: new Date().toISOString()
  }

  notes = [...notes, newNote]

  resp.status(201).send(newNote)
})

app.use((req, resp) => {
  resp.status(404).send({
    error: 'Not Found'
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, null, () => {
  console.log(`Running on port ${PORT}`)
})
