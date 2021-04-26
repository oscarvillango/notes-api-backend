require('dotenv').config()
require('./mongo')
const express = require('express')
const cors = require('cors')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const logger = require('./middlewares/loggerMiddleware')
const handleErrors = require('./middlewares/handleErrors')

const userRouter = require('./controllers/users')
const noteRouter = require('./controllers/notes')

const app = express()

Sentry.init({
  dsn: 'https://28e38670c3814e97957699bf4942e31c@o578766.ingest.sentry.io/5735175',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

app.use(cors())
app.use(express.json())
app.use(logger)

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.get('/', (req, res) => {
  res.send('<h1>Hola Mundo</h1>')
})

app.use('/api/notes', noteRouter)
app.use('/api/users', userRouter)

app.use((req, resp) => {
  resp.status(404).send({
    error: 'Not Found'
  })
})

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

app.use(handleErrors)

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, null, () => {
  console.log(`Running on port ${PORT}`)
})

module.exports = { app, server }
