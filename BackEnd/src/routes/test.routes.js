import { Router } from "express"
import { authorization, passportError } from "../utils/messageErrors.js"
import { mockController } from "../controllers/mock.controller.js"

const routerTest = Router()
const controller = new mockController()

routerTest.get('/mockingusers', passportError('jwt'), authorization(['admin']), controller.createRandomUser(100))

routerTest.get('/mockingproducts', passportError('jwt'), authorization(['admin']), controller.createRandomProduct(100))

export default routerTest