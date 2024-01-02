import { Router } from "express"
import passport from "passport"
import { usersController } from "../controllers/users.controller.js"
import { passportError } from "../utils/messageErrors.js"
import { upload} from "../middlewares/multer/UserDocs.js"

const routerUsers = Router()
const controller = new usersController()

routerUsers.post('/', passport.authenticate('register'), controller.postUser)
routerUsers.post('/password-recovery', controller.postPasswordRecovery)
routerUsers.post('/reset-password/:token', controller.postResetPassword)
routerUsers.post('/:uid/documents', passportError('jwt'), upload.array('userDocument', 10), controller.postUploadDocument)
routerUsers.get('/', controller.getAllUsers)
routerUsers.delete('/', controller.deleteInactiveUsers)

export default routerUsers