import enviroment from '../config/enviroment.js'
import jwt from 'jsonwebtoken'

export const generateToken = (user) => {
    
    const token = jwt.sign({ user }, enviroment.JWT_SECRET, { expiresIn: '12h' })
    return token
}

export const authToken = (req, res, next) => {
    //Consulto el header
    const authHeader = req.headers.Authorization //Consulto si existe el token
    if (!authHeader) {
        return res.status(401).send({ status: false, error: 'Usuario no autenticado' })
    }

    const token = authHeader.split(' ')[1]

    jwt.sign(token, enviroment.JWT_SECRET, (error, credentials) => {
        if (error) {
            return res.status(403).send({ status: false,  error: "Usuario no autorizado" })
        }
        req.user = credentials.user
        next()
    })
}