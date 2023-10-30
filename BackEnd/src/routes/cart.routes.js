import { Router } from "express"
import { authorization, passportError } from "../utils/messageErrors.js"
import { cartsController } from "../controllers/carts.controller.js"

const routerCarts = Router()
const controller = new cartsController

routerCarts.post('/', controller.postCart)// Crea un nuevo carrito vacio

routerCarts.post('/:cid/products/:pid', controller.postProductInCart)// Agrega un producto por su id al carrito

routerCarts.get('/:cid', controller.getProductsFromCart)// Lista los productos del carrito

routerCarts.put('/:cid', controller.putArrayOnCart)// Agrega un array al carrito

routerCarts.put('/:cid/products/:pid', controller.putUpdateProductCuantity)// Actualiza solo quantity 

routerCarts.delete('/:cid', controller.deleteEmptyCart)// Vaciar el carrito

routerCarts.delete('/:cid/products/:pid', controller.deleteProductFromCart)// Elimina un producto especifico del carrito

routerCarts.post('/:cid/purchase', passportError('jwt'), authorization('user'), controller.postPurchase)// Finalizar compra

export default routerCarts