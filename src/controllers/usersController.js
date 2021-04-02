const mongoose = require('mongoose')
const Users = mongoose.model('Users')
const bcrypt = require('bcryptjs')
var salt = bcrypt.genSaltSync(13)
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.json')
const path = require('path')


module.exports = {
    //normal case
    async signin (req,res){
        function gerarToken(params = {}){
            return jwt.sign(params, authConfig.secret, { expiresIn: 85999 });
        }
        const user = await Users.findOne({user:req.body.user}).select('+password')
        //verifica se o usuário existe
        if (user == null){
            return res.json('invalid username or password')
        }
        //verifica se a senha é valida
        if (!await bcrypt.compare(req.body.password, user.password)){
            return res.json('invalid username or password')
        }
        user.password = undefined
        const newToken = gerarToken({ id: user.id })
        let olderTokens = user.token || [] //recebe os tokens que o usuário já tem
        if (olderTokens.length >= 10) { //se o usuário tiver 10 tokens salvos o mais antigo será deletado
            olderTokens.splice(0,1)
        }
        olderTokens.push(newToken) // adiciona o novo token a lista de tokens do usuário
        const newUser = await Users.findOneAndUpdate({user:req.body.user}, {token: olderTokens}) //salva o novo token
        res.send({
                user, 
                token: newToken,
        })
    },
    async verifyUser(req,res){
        function gerarToken(params = {}){
            return jwt.sign(params, authConfig.secret, { expiresIn: 85999 });
        }
        const user = await Users.findOne({user:req.body.user}).select('+password') //procura o usuário na db
        if (user == null){//verifica se o usuário existe
            return res.status(401).json('invalid username')
        }
        user.password = undefined
        let confirmedToken = 0
        let userTokens = user.token || [] //recebe os tokens que o usuário já tem salvo
            userTokens.map((token, i) =>{//verificar os 10 ultimos tokens que o usuário gerou
                if (req.body.token === token) {//verifica se o token enviado está no histórico do usuário
                    confirmedToken++
                    jwt.verify(token, authConfig.secret, (err, decoded) => { //verifica se o token ainda está válido
                        if (err) {//caso não seteja válido mas no histórico gera um novo token
                            const newToken = gerarToken({ id: user.id })
                            userTokens.splice(i,1, newToken) //apaga o token inválido e coloca o novo token no lugar
                            user.token = undefined
                            if (user.active) {
                                return res.send({
                                    user, 
                                    token: newToken,
                                })
                            }
                            else {
                                return res.send({user})
                            }
                        }
                        else { //caso o token ainda esteja válido ele só envia de volta todas as informações recebidas
                            return res.send({user, token: req.body.token})
                        }
                    })
                }
            })
        if (confirmedToken === 0) {
            return res.status(401).json('invalid token') // se não encontrar o token no histórico retorna invalid token
        }
    },
    async signup (req,res){
        function gerarToken(params = {}){
            return jwt.sign(params, authConfig.secret, { expiresIn: 85999 });
        }
        try {
            if ( await Users.findOne({ user:req.body.user }) ){
                return res.json('user already in use')
            }
            if (await Users.findOne({ email:req.body.email })) {
                return res.json('email already in use')
            }
            var hash = bcrypt.hashSync(req.body.password, salt)
            
            const user = await Users.create({
                name:req.body.name,
                user: req.body.user,
                email: req.body.email,
                password: hash 
            })
            //remove a senha da resposta
            user.senha = undefined
            return res.send({ 
                user:user.user,
                name:user.name,
                email:user.email,
                data: user.data,
                token: gerarToken({ id: user.id }),
             })
        } 
        catch (err){
            console.log(err)
            return res.json('error when registering')
        }
    },
    async verifyUserNameAndEmail(req, res){
        if ( await Users.findOne({ user:req.body.user }) ){
            return res.json('user already in use')
        }
        if (await Users.findOne({ email:req.body.email })) {
            return res.json('email already in use')
        }
        else {
            return res.json('ok')
        }
    },
    async updateData(req,res){
        console.log(req.body)
        const filter = req.body._id
        const update = {data: req.body.data}
        var response = await Users.findByIdAndUpdate(filter,update, {new: true})
        response.password = undefined
        res.send({response})
    },
    async deleteUser(req,res){
        const filter = req.body._id
        const response = await Users.findByIdAndRemove(filter, {new: true})
        res.send(response)
    }
    ,
    home (req,res){
        return res.send("API Organizer")
    }
}