import { Router } from "express"
import passport from "passport"
import { passportError} from '../utils/messageErrors.js'
import { generateToken } from "../utils/jwt.js"
import userModel from "../models/users.models.js"
import CustomError from "../services/errors/CustomError.js"
import EErrors from "../services/errors/enums.js"

const routerSessions = Router()

routerSessions.get('/current', passportError('jwt'), async (req, res) => {// Devuelve la sesion actual
    res.status(200).send({ status: true, user: req.user })
})

routerSessions.post('/login', passport.authenticate('login'), async (req, res) => {//Login
    // console.log(req.user)
    // console.log(req.session)
    try {
        if (!req.user) {
            res.status(401).send({ status: false, error: "Email o contraseña invalida" })
        } else {
            // req.session.user = {
            //     first_name: req.user.first_name,
            //     last_name: req.user.last_name,
            //     age: req.user.age,
            //     email: req.user.email,
            //     rol: req.user.rol
            // }

            await userModel.findByIdAndUpdate(req.user.id, { last_connection: new Date() })

            const token = generateToken(req.user)

            res.cookie('jwtCookie', token, {
                httpOnly: true,
                maxAge: 43200000
            })
            res.status(200).send({ status: true, token: token })//req.user
        }
    } catch (error) {
        res.status(500).send({ status: false, error: `Error al iniciar sesion ${error}` })
    }
})

routerSessions.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { //Login GitHub
    // req.session.user = req.user
    await userModel.findByIdAndUpdate(req.user.id, { last_connection: new Date() })
    const token = generateToken(req.user)

    res.cookie('jwtCookie', token, {
        httpOnly: true,
        maxAge: 43200000
    })

    if (req.user) {//req.session.user
        res.status(200).redirect('/static/products')
    } else {
        res.status(200).render('login', {
            script: "login",
            title: "Login",
            css: "login",
        })
    }
})

routerSessions.get('/logout', async (req, res, next) => { //Logout
    try {
        if (!req.user) {
            CustomError.createError({
                name: 'Logout Error',
                cause: 'No hay ningun usuario logueado',
                message: 'Usuario no logueado',
                code: EErrors.VOID_OBJECT,
                level: 3,
            })
        }

        await userModel.findByIdAndUpdate(req.user.id, { last_connection: new Date() })

        if (req.session) {
            req.session.destroy()
        }
        res.clearCookie('jwtCookie')
        res.status(200).send({ status: true, data: 'Login eliminado' })
    } catch (error) {
        next(error)
    }

})

export default routerSessions