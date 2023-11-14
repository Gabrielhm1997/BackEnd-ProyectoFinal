import passport from "passport"
import CustomError from "../services/errors/CustomError.js"
import EErrors from "../services/errors/enums.js"


export const passportError = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (error, user, info) => {
            try {
                if (error) {
                    return next(error)
                }

                if (!user) {
                    const infoD = info.toString().split(':')
                    
                    CustomError.createError({
                        name: "Token Error",
                        cause: info.messages ? info.messages : `${infoD[1]}`,
                        message: info.messages ? info.messages : `${infoD[0]}`, //
                        code: EErrors.INVALID_TYPE,
                        level: 3,
                        status: 401
                    })
                    //return res.status(401).send({ status: false , error: info.messages ? info.messages : info.toString() })
                }

                req.user = user
                next()
            } catch (error) {
                next(error)
            }
        })(req, res, next)
    }
}

export const authorization = (rol) => {

    return async (req, res, next) => {

        try {
            if (!req.user) {
                CustomError.createError({
                    name: "Authorization Error",
                    cause: 'Usuario no autenticado',
                    message: 'Usuario no autenticado',
                    code: EErrors.INVALID_TYPE,
                    level: 3,
                    status: 401
                })
                //return res.status(401).send({ status: false, error: 'Usuario no autenticado' })
            }
            if (req.user.rol != rol) {
                CustomError.createError({
                    name: "Authorization Error",
                    cause: 'Usuario no autorizado',
                    message: 'Usuario no autorizado',
                    code: EErrors.INVALID_TYPE,
                    level: 3,
                    status: 403
                })
                //return res.status(403).send({ status: false, error: 'Usuario no autorizado' })
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}