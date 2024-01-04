import { Router } from "express"
import { authorization, passportError } from "../utils/messageErrors.js"
import { cartsController } from "../controllers/carts.controller.js"

const routerCarts = Router()
const controller = new cartsController
 
routerCarts.post('/', passportError('jwt'), authorization(['admin']), controller.postCart)// Crea un nuevo carrito vacio

routerCarts.post('/:cid/product/:pid', passportError('jwt'), authorization(['user','premium']), controller.postProductInCart)// Agrega un producto por su id al carrito

routerCarts.get('/:cid', controller.getProductsFromCart)// Lista los productos del carrito

routerCarts.get('/', passportError('jwt'), authorization(['admin']), controller.getCarts) // Devuelve todos los carritos

routerCarts.put('/:cid', passportError('jwt'), authorization(['user','premium']), controller.putArrayOnCart)// Agrega un array al carrito

routerCarts.put('/:cid/product/:pid', passportError('jwt'), authorization(['user','premium']), controller.putUpdateProductQuantity)// Actualiza solo quantity 

routerCarts.delete('/:cid', passportError('jwt'), authorization(['user','premium']), controller.deleteEmptyCart)// Vaciar el carrito

routerCarts.delete('/:cid/product/:pid', passportError('jwt'), authorization(['user','premium']), controller.deleteProductFromCart)// Elimina un producto especifico del carrito

routerCarts.post('/:cid/purchase', passportError('jwt'), authorization(['user','premium']), controller.postPurchase)// Finalizar compra

export default routerCarts