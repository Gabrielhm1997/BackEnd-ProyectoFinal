import 'dotenv/config'
import passport from 'passport'
import jwt from 'passport-jwt'
import local from 'passport-local'
import GithubStrategy from 'passport-github2'
import userModel from '../models/users.models.js'
import { createHash, validatePassword } from '../utils/bcrypt.js'

const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const initializePassport = () => {

    const safeUser = (user) => {

        const safeUser = {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            email: user.email,
            rol: user.rol
        }
        return safeUser
    }

    const cookieExtractor = req => {
        const token = req.cookies ? req.cookies.jwtCookie : {} //req.cookies ? req.cookies.jwtCookie : {}
        return token
    }

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET
    }, async (jwt_payload, done) => {
        //console.log(jwt_payload)

        try {
            return done(null, jwt_payload.user)
        } catch (error) {
            return done(error, false)
        }
    }))

    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {

        const { first_name, last_name, email, age } = req.body
        try {
            const user = await userModel.findOne({ email: email })

            if (user) {
                return done(null, false)
            } else {
                const passwordHash = createHash(password)
                const newUser = await userModel.create({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    age: age,
                    password: passwordHash
                })
                return done(null, safeUser(newUser))
            }
        } catch (error) {
            return done(error, false)
        }
    }))

    passport.use('login', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {

        try {
            const user = await userModel.findOne({ email: username })
            
            if (!user) {
                return done(null, false)
            } else if (validatePassword(password, user.password)) {
                return done(null, safeUser(user)) //Usuario y contraseña validos
            } else {
                return done(null, false) //Contraseña no valida
            }
        } catch (error) {
            console.log(error)
            return done(error, false)
        }
    }))

    passport.use('github', new GithubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL

    }, async (accessToken, refreshToken, profile, done) => {

        try {
            // console.log(accessToken)
            // console.log(refreshToken)
            // console.log(process.env.CALLBACK_URL)
            const user = await userModel.findOne({ email: profile._json.email })

            if (user) {
                done(null, safeUser(user))
            } else {
                const userCreated = await userModel.create({
                    first_name: profile._json.name,
                    last_name: 'Undefined',
                    email: profile._json.email,
                    age: 18, //Edad por defecto,
                    password: createHash('password')
                })
                done(null, userCreated)
            }
        } catch (error) {
            done(error)
        }
    }))

    //Inicializar la session del user
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    //Eliminar la session del user
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport