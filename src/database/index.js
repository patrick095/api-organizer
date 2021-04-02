require('dotenv').config()
const mongoose = require('mongoose')
const MongoUrl = process.env.MONGODB_URL || 'mongodb+srv://admin:VSK33cm@2hkgAZL@cluster0.jiyct.mongodb.net/Scoreboard?retryWrites=true&w=majority'
//mongoose.connect(`${process.env.MONGO_DB}`,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
mongoose.connect(`${MongoUrl}`,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
mongoose.set('useCreateIndex', true)
console.log("conectado a db com sucesso!")
module.exports = mongoose