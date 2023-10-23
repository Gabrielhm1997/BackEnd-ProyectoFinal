import { Router } from "express"
import passport from "passport"
import { passportError, authorization } from '../utils/messageErrors.js'
import { generateToken } from "../utils/jwt.js"

const routerSessions = Router()
 
routerSessions.get('/current', passportError('jwt'), async (req, res) => {
    res.status(200).send({ status: true, data: req.user})
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

            const token = generateToken(req.user)
            
            res.cookie('jwtCookie', token, {
                httpOnly: true,
                maxAge: 43200000
            }) 
            res.status(200).send({ status: true, data: token  })//req.user
        }
    } catch (error) {
        res.status(500).send({ status: false, error: `Error al iniciar sesion ${error}` })
    }
})

routerSessions.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { //Login GitHub
    // req.session.user = req.user
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

routerSessions.get('/logout', (req, res) => { //Logout
    if (req.session) {
        req.session.destroy()
    }
    res.clearCookie('jwtCookie')
    res.status(200).send({ status: true, data: 'Login eliminado' })
})

export default routerSessions