const express = require('express')
const routes = express.Router()
const usersController = require('./controllers/usersController')


//rotas
routes.get('/', usersController.home)
// routes.get('/scoreboard', usersController.scoreboard)
//login
routes.post('/signin', usersController.signin)
routes.post('/signup', usersController.signup)
routes.post('/verifyusernameandemail', usersController.verifyUserNameAndEmail)
//verifica se o usuário está ativo e se o token é valido, caso o token tenha expirado ele renova
routes.post('/verifyuser', usersController.verifyUser)

module.exports = routes