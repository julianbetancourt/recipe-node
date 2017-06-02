const mongoose = require('mongoose')
const app = require('./app')


require('dotenv').config({ path: '.env' })

mongoose.connect(process.env.DATABASE)
mongoose.connection.on('error', err => {console.error(`🤕 🤕 🤕 => ${err}`)})
mongoose.Promise = global.Promise

const server = app.listen(process.env.PORT || 3050, () => {
  console.log(`App running on port ${process.env.PORT}`)
})
