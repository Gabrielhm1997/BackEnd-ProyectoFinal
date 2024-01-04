import 'dotenv/config'
import enviroment from './enviroment.js'
import passport from 'passport'
import jwt from 'passport-jwt'
import local from 'passport-local'
import GithubStrategy from 'passport-github2'
import userModel from '../models/users.models.js'
import { createHash, validatePassword } from '../utils/bcrypt.js'

import CustomError from '../services/errors/CustomError.js'
import EErrors from '../services/errors/enums.js'
import { generateUserErrorInfo } from '../services/errors/info.js'

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
            rol: user.rol,
            cart: user.cart,
            last_connection: user.last_connection ?? new Date()
        }
        return safeUser
    }

    const cookieExtractor = req => {

        let headerToken = req.headers ? req.headers.authorization : null;
        const cookiesToken = req.cookies ? req.cookies.jwtCookie : null;

        headerToken = headerToken ? headerToken.replace('Bearer ', '') : null;

        return headerToken || cookiesToken || {};
    }

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: enviroment.JWT_SECRET
    }, async (jwt_payload, done) => {

        try {
            return done(null, jwt_payload.user)
        } catch (error) {
            return done(error, false)
        }
    }))

    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {// -- HandlerError

        const { first_name, last_name, email, age } = req.body
        try {
            if (!first_name || !last_name || !email) {

                CustomError.createError({
                    name: "User creation Error",
                    cause: generateUserErrorInfo({ first_name, last_name, email, age }),
                    message: "Error Trying to create User",
                    code: EErrors.INVALID_TYPE,
                    level: 3
                })
            }
            const user = await userModel.findOne({ email: email })

            if (user) {
                CustomError.createError({
                    name: "User creation Error",
                    cause: "User Alredy Registered",
                    message: "Error Trying to create User",
                    code: EErrors.DATABASE,
                    level: 3
                })
            } else {
                const passwordHash = createHash(password)
                const newUser = await userModel.create({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    age: age ?? 18,
                    password: passwordHash
                })
                return done(null, safeUser(newUser))
            }
        } catch (error) {
            return done(error, false)
        }
    }))

    passport.use('login', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {// -- HandlerError

        try {
            const user = await userModel.findOne({ email: username })

            if (!user) {
                CustomError.createError({
                    name: "Login Error",
                    cause: "Usuario o contraseña incorrectos",
                    message: "Usuario o contraseña incorrectos",
                    code: EErrors.DATABASE,
                    level: 3
                })
            } else if (validatePassword(password, user.password)) {
                return done(null, safeUser(user)) //Usuario y contraseña validos
            } else {
                CustomError.createError({
                    name: "Login Error",
                    cause: "Usuario o contraseña incorrectos",
                    message: "Usuario o contraseña incorrectos",
                    code: EErrors.DATABASE,
                    level: 3
                })
            }
        } catch (error) {
            return done(error, false)
        }
    }))

    passport.use('github', new GithubStrategy({
        clientID: enviroment.CLIENT_ID,
        clientSecret: enviroment.CLIENT_SECRET,
        callbackURL: enviroment.CALLBACK_URL

    }, async (accessToken, refreshToken, profile, done) => {

        try {
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