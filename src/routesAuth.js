const express = require('express')
const routes = express.Router()
const usersController = require('./controllers/usersController')
const authMiddleware = require('./middlewares/auth')

routes.use(authMiddleware)

routes.post('/deleteuser', usersController.deleteUser)
routes.post('/updatedata', usersController.updateData)

module.exports = routes