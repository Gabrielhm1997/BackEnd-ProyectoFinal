import userModel from "../models/users.models.js"
import { generateToken } from "../utils/jwt.js"

export class usersController {
    constructor() { }

    postUser = async (req, res) => {
        try {
            if (!req.user) {
                res.status(400).send({ status: false, mensaje: 'Usuario ya existente' })
            }

            const token = generateToken(req.user)

            res.cookie('jwtCookie', token, {
                httpOnly: true,
                maxAge: 43200000
            })
            res.status(200).send({ status: true, mensaje: 'Usuario creado' })
        } catch (error) {
            res.status(500).send({ status: false, mensaje: `Error al crear usuario ${error}` })
        }
    }
}