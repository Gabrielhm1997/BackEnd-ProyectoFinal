import cartModel from "../models/cart.models.js"
import productModel from "../models/products.models.js"
import ticketModel from "../models/ticket.models.js"

import CustomError from "../services/errors/CustomError.js"
import EErrors from "../services/errors/enums.js"
import { generateProductIntoCartErrorInfo } from "../services/errors/info.js"

export class cartsController {

    postCart = async (req, res, next) => {// Crea un nuevo carrito Vacio
        try {
            const cart = await cartModel.create({})
            res.status(201).send({status: true, cart: cart})

        } catch (error) {
            next(error)
        }
    }

    postProductInCart = async (req, res, next) => {// Agrega un producto por su id al carrito
        const { cid, pid } = req.params
        const { quantity } = req.body

        try {

            if (!cid || !pid || !quantity) {

                CustomError.createError({
                    name: "Load Product Into Cart",
                    cause: generateProductIntoCartErrorInfo(cid, pid, quantity),
                    message: "Error Trying to Load Product Into Cart",
                    code: EErrors.INVALID_TYPE,
                    level: 3
                })
            }

            const cartFound = await cartModel.findById(cid)
            if (cartFound) {
                const productCollectionFound = await productModel.findById(pid)
                if (productCollectionFound) {
                    const productCartFound = cartFound.products.find(product => product.id_prod._id.toString() === pid)
                    if (productCartFound) {
                        CustomError.createError({
                            name: "Load Product Into Cart",
                            cause: "The product already exists in the cart",
                            message: "Error Trying to Load Product Into Cart",
                            code: EErrors.INVALID_TYPE,
                            level: 3
                        })
                    } else {
                        cartFound.products.push({ id_prod: pid, quantity: quantity })
                        await cartFound.save()
                        res.status(200).send({ status: true, products: cartFound.products })
                    }
                } else {
                    CustomError.createError({
                        name: "Load Product Into Cart",
                        cause: "Product Not Found",
                        message: "Error Trying to Load Product Into Cart",
                        code: EErrors.DATABASE,
                        level: 3
                    })
                }
            } else {
                CustomError.createError({
                    name: "Load Product Into Cart",
                    cause: "Cart Not Found",
                    message: "Error Trying to Load Product Into Cart",
                    code: EErrors.DATABASE,
                    level: 3
                })
            }
        } catch (error) {
            next(error)
        }
    }

    getProductsFromCart = async (req, res, next) => {// Lista los productos del carrito

        const { cid } = req.params

        try {

            if (!cid) {
                CustomError.createError({
                    name: "Get Cart From DataBase",
                    cause: `One or more properties were incomplete or not valid.
                    List of required properties:
                    * Cart ID : need to be a valid ID, recived ${cid}`,
                    message: "Error Trying to Getting Cart From DataBase",
                    code: EErrors.INVALID_TYPE,
                    level: 3
                })
            }

            const cart = await cartModel.findOne({ _id: cid })
            if (cart) {
                const products = cart.products
                if (products.length > 0) {
                    res.status(200).send({ status: true, products: products ?? [] })
                } else {
                    res.status(200).send({ status: true, products: [] })
                }
            } else {
                CustomError.createError({
                    name: "Get Cart From DataBase",
                    cause: "Cart Not Found",
                    message: "Error Trying to Getting Cart From DataBase",
                    code: EErrors.DATABASE,
                    level: 3
                })
            }
        } catch (error) {
            next(error)
        }
    }

    getCarts = async (req, res, next) => {// Devuelve todos los carritos
        try {
            const carts = await cartModel.find()
            res.status(200).send({ status: true, carts: carts })
        } catch (error) {
            next(error)
        }
    }

    putArrayOnCart = async (req, res, next) => {// Agrega un array al carrito
        const { cid } = req.params
        const { arrayProducts } = req.body

        let i = 0
        let invalidProducts = []

        try {
            const cartFound = await cartModel.findById(cid)

            if (cartFound) {

                const recursiva = async () => {

                    if (i < arrayProducts.length) {

                        let productCartFound = cartFound.products.find(product => product.id_prod._id.toString() === arrayProducts[i].id_prod)

                        if (productCartFound) {

                            productCartFound.quantity = arrayProducts[i].quantity
                            await cartFound.save()
                            i += 1
                            recursiva()

                        } else {
                            try {
                                let productCollectionFound = null
                                productCollectionFound = await productModel.findById(arrayProducts[i].id_prod)

                                if (productCollectionFound) {
                                    cartFound.products.push(arrayProducts[i])
                                    await cartFound.save()
                                    i += 1
                                    recursiva()
                                } else {
                                    invalidProducts.push(arrayProducts[i])
                                    i += 1
                                    recursiva()
                                }
                            } catch (error) {
                                next(error)
                            }
                        }
                    } else {
                        res.status(200).send({ status: true, cart: cartFound, invalidProducts: invalidProducts })
                    }
                }
                recursiva()
            } else {

                CustomError.createError({
                    name: "Load Product Into Cart",
                    cause: "Cart not Found",
                    message: "Carrito no encontrado en la Base de Datos",
                    code: EErrors.DATABASE,
                    level: 3
                })
            }
        } catch (error) {
            next(error)
        }
    }

    putUpdateProductQuantity = async (req, res, next) => {// Actualiza solo quantity 
        const { cid, pid } = req.params
        const { quantity } = req.body

        try {

            const cartFound = await cartModel.findById(cid)

            if (cartFound) {

                const productCartFound = cartFound.products.find(product => product.id_prod._id.toString() === pid)

                if (productCartFound) {

                    productCartFound.quantity = quantity
                    await cartFound.save()
                    res.status(200).send({ status: true, products: cartFound.products ?? [] })

                } else {
                    CustomError.createError({
                        name: "Modify Product Quantity",
                        cause: "Product not Found in Cart",
                        message: "El producto no se encuentra cargado en el carrito",
                        code: EErrors.DATABASE,
                        level: 3
                    })
                }
            } else {
                CustomError.createError({
                    name: "Modify Product Quantity",
                    cause: "Cart not Found",
                    message: "Carrito no encontrado en la Base de Datos",
                    code: EErrors.DATABASE,
                    level: 3
                })
            }
        } catch (error) {
            next(error)
        }
    }

    deleteEmptyCart = async (req, res, next) => {// Vaciar el carrito

        const { cid } = req.params

        try {

            const cartFound = await cartModel.findById(cid)

            if (cartFound) {

                cartFound.products = []
                await cartFound.save()

                res.status(200).send({status: true, products: cartFound.products})

            } else {
                CustomError.createError({
                    name: "Empty Cart",
                    cause: "Cart not Found",
                    message: "Carrito no encontrado en la Base de Datos",
                    code: EErrors.DATABASE,
                    level: 3
                })
            }

        } catch (error) {
            next(error)
        }
    }

    deleteProductFromCart = async (req, res, next) => {// Elimina un producto especifico del carrito
        const { cid, pid } = req.params

        try {

            const cartFound = await cartModel.findById(cid)

            if (cartFound) {

                const productCartFound = cartFound.products.find(product => product.id_prod._id.toString() === pid)

                if (productCartFound) {

                    const indice = cartFound.products.indexOf(productCartFound)
                    cartFound.products.splice(indice, 1)
                    await cartFound.save()
                    res.status(200).send({ status: true, products: cartFound.products ?? [] })

                } else {
                    CustomError.createError({
                        name: "Delete Product from Cart",
                        cause: "Product not Found in Cart",
                        message: "El producto no se encuentra cargado en el carrito",
                        code: EErrors.DATABASE,
                        level: 3
                    })
                }
            } else {
                CustomError.createError({
                    name: "Delete Product from Cart",
                    cause: "Cart not Found",
                    message: "Carrito no encontrado en la Base de Datos",
                    code: EErrors.DATABASE,
                    level: 3
                })
            }
        } catch (error) {
            next(error)
        }
    }

    postPurchase = async (req, res, next) => {// Finalizar compra
        const { cid } = req.params
        let i = 0


        try {
            if (req.user.cart == cid) {
                const cart = await cartModel.findById(cid)

                if (cart) {

                    if (cart.products.length > 0) {

                        const validProducts = []

                        const asyncFilter = async () => {

                            if (i < cart.products.length) {

                                const dbProduct = await productModel.findById(cart.products[i].id_prod)

                                if (cart.products[i].quantity <= (dbProduct.stock)) {

                                    dbProduct.stock = dbProduct.stock - cart.products[i].quantity
                                    await dbProduct.save()

                                    validProducts.push(cart.products[i])
                                }

                                i += 1
                                asyncFilter()
                            } else {

                                if (validProducts.length > 0) {
                                    let total = 0

                                    validProducts.forEach(product => {
                                        total += (product.id_prod.price * product.quantity)
                                    })

                                    if (req.user.rol == "premium") {
                                        total = (total - (total * 0.1))
                                    }

                                    const ticket = await ticketModel.create({ purchaser: req.user.email, amount: total, purchased_products: validProducts })

                                    cart.products = []
                                    await cart.save()

                                    res.status(200).send({status: true, ticket: ticket })
                                } else {
                                    CustomError.createError({
                                        name: "Purchase Error",
                                        cause: "Empty Cart",
                                        message: "Carrito Vacio",
                                        code: EErrors.VOID_OBJECT,
                                        level: 3
                                    })
                                }
                            }
                        }
                        asyncFilter()
                    } else {
                        CustomError.createError({
                            name: "Purchase Error",
                            cause: "Empty Cart",
                            message: "Carrito Vacio",
                            code: EErrors.VOID_OBJECT,
                            level: 3
                        })
                    }
                } else {
                    CustomError.createError({
                        name: "Purchase Error",
                        cause: "Cart not Found",
                        message: "Carrito no encontrado en la Base de Datos",
                        code: EErrors.DATABASE,
                        level: 3
                    })
                }
            } else {
                CustomError.createError({
                    name: "Purchase Error",
                    cause: "Invalid Cart",
                    message: "El Carrito no coincide con el carrito del Usuario",
                    code: EErrors.DATABASE,
                    level: 3
                })
            }
        } catch (error) {
            next(error)
        }
    }
}