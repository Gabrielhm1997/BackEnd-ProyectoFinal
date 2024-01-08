import { Router } from "express"
import passport from "passport"
import { usersController } from "../controllers/users.controller.js"
import { passportError } from "../utils/messageErrors.js"
import { upload } from "../middlewares/multer/UserDocs.js"
import { authorization } from "../utils/messageErrors.js"

const routerUsers = Router()
const controller = new usersController()

//routerUsers.post('/', passport.authenticate('register'), controller.postUser)// Registro
routerUsers.post('/password-recovery', controller.postPasswordRecovery)// Recuperacion de contraseña
routerUsers.post('/reset-password/:token', controller.postResetPassword)// Reseteo de contraseña
routerUsers.post('/:uid/documents', passportError('jwt'), upload.array('userDocument', 10), controller.postUploadDocument)// Carga de documentos de Usuarios
routerUsers.get('/', controller.getAllUsers)// Devuelve todos los usuarios
routerUsers.delete('/', passportError('jwt'), authorization(['admin']), controller.deleteInactiveUsers)// Elimina usuarios inactivos

export default routerUsers