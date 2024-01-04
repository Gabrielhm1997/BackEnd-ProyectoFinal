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
                        message: info.messages ? info.messages : `${infoD[0]}`,
                        code: EErrors.INVALID_TYPE,
                        level: 3,
                        status: 401
                    })
                }
                req.user = user
                next()
            } catch (error) {
                next(error)
            }
        })(req, res, next)
    }
}

export const authorization = (roles) => {

    return async (req, res, next) => {

        let rolCheck = false

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
            }

            roles.forEach(rol => {
                if (req.user.rol == rol) {
                    rolCheck = true
                }
            })

            if (rolCheck) {
                next()
            } else {
                CustomError.createError({
                    name: "Authorization Error",
                    cause: 'Usuario no autorizado',
                    message: 'Usuario no autorizado',
                    code: EErrors.INVALID_TYPE,
                    level: 3,
                    status: 403
                })
            }
        } catch (error) {
            next(error)
        }
    }
}