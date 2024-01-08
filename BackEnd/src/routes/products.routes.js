import { Router } from "express"
import { authorization, passportError } from "../utils/messageErrors.js"
import { productsController } from "../controllers/products.controller.js"

const routerProducts = Router()
const controller = new productsController()

routerProducts.get('/', controller.getProducts)// Devuelve los productos segun el filtro

routerProducts.get('/:id', controller.getProductByID)// Devuelve un producto segun su ID

routerProducts.post('/', passportError('jwt'), authorization(['admin']), controller.postProduct)// Crea un producto

routerProducts.put('/:id', passportError('jwt'), authorization(['admin']), controller.putProduct)// Modifica un producto

routerProducts.delete('/:id', passportError('jwt'), authorization(['admin']), controller.deleteProduct)// Elimina un producto

export default routerProducts