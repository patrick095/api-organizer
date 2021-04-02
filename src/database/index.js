require('dotenv').config()
const mongoose = require('mongoose')
const MongoUrl = process.env.MONGODB_URL
mongoose.connect(`${MongoUrl}`,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
mongoose.set('useCreateIndex', true)
console.log("conectado a db com sucesso!")
module.exports = mongoose