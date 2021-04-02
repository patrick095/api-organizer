const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.json')
const path = require('path')


module.exports = (req, res, next ) => {
    const authHeader = req.query.api
    if (!authHeader){
        console.log("token não informado!")
        return res.status(401).send({ erro: "token não informado!"})
    }

    const parts = authHeader.split(' ')
    if (!parts.lenght === 2){
        console.log("token incompleto!")
        return res.status(401).send({ erro: "token incompleto!"})
    }
    const [ scheme, token ] = parts
    
    if (!/^Bearer$/i.test(scheme)){
        console.log("token mal formado!")
        return res.status(401).send({ erro: "token mal formado!"})
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
            console.log("token inválido!")
            return res.status(401).send({ erro: "token inválido!"})
            // return res.status(401).send({ erro: "token inválido!"})
        }
        req.userId = decoded.id 
        return next()
    })
}