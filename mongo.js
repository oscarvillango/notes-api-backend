const mongoose = require('mongoose')

const { MONGODB_URI, MONGODB_URI_TEST, NODE_ENV } = process.env

const connectionString = NODE_ENV === 'test' ? MONGODB_URI_TEST : MONGODB_URI

mongoose.connect(connectionString,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log('All good'))
  .catch(err => console.log(err))

process.on('uncaughtException', () => {
  mongoose.connection.close()
})
