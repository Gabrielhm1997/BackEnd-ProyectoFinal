import { Router } from "express"
import { authorization, passportError } from "../utils/messageErrors.js"
import { productsController } from "../controllers/products.controller.js"

const routerProducts = Router()
const controller = new productsController()

// ?type=title&query=teclado&limit=3&page=1&sort=desc
routerProducts.get('/', controller.getProducts)

routerProducts.get('/:id', controller.getProductByID)

routerProducts.post('/', passportError('jwt'), authorization('admin'), controller.postProduct)

routerProducts.put('/:id', passportError('jwt'), authorization('admin'), controller.putProduct)

routerProducts.delete('/:id', passportError('jwt'), authorization('admin'), controller.deleteProduct)

export default routerProducts