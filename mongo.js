const mongoose = require('mongoose')

const connectionString = process.env.MONGODB_URI

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
