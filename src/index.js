const express = require('express')
const cors = require('cors')
const requireDir = require('require-dir')

const app = express()
app.use(express.json())
app.use(cors())

//models
requireDir('./models/')

app.use('/', require('./routes'))
app.use('/auth', require('./routesAuth'))

app.listen(process.env.PORT || 3001)