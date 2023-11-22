import { Router } from "express"
import passport from "passport"
import { usersController } from "../controllers/users.controller.js"

const routerUsers = Router()
const controller = new usersController()

routerUsers.post('/', passport.authenticate('register'), controller.postUser)
routerUsers.post('/password-recovery', controller.postPasswordRecovery)
routerUsers.post('/reset-password/:token', controller.postResetPassword)

export default routerUsers