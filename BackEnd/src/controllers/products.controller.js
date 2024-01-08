import productModel from "../models/products.models.js"

import CustomError from "../services/errors/CustomError.js"
import EErrors from "../services/errors/enums.js"
import { generateProductErrorInfo } from "../services/errors/info.js"

export class productsController {
    constructor() { }

    getProducts = async (req, res, next) => {// Devuelve los productos segun el filtro
        const { limit, page, sort, category } = req.query

        let queryType = ""

        if (category) {
            queryType = { category: category }
        }

        try {
            const inventory = await productModel.paginate(queryType, { limit: limit ?? 10, page: page ?? 1, sort: { price: sort } })
            const response = { status: true, ...inventory }
            res.status(200).send(response)
        } catch (error) {
            next(error)
        }
    }

    getProductByID = async (req, res, next) => {// Devuelve un producto por su ID

        const { id } = req.params

        try {
            const product = await productModel.findById(id)
            if (product) {
                res.status(200).send({ status: true, product: product })
            } else {
                CustomError.createError({
                    name: "Get Product Error",
                    cause: "Product Not Found",
                    message: "El producto no se encuentra en la base de datos",
                    code: EErrors.DATABASE,
                    level: 3
                })
            }
        } catch (error) {
            next(error)
        }
    }

    postProduct = async (req, res, next) => { // Crea un producto
        const { title, description, stock, code, price, category } = req.body

        try {

            if (!title || !description || !stock || !code || !price || !category) {

                CustomError.createError({
                    name: "Product creation Error",
                    cause: generateProductErrorInfo({ title, description, stock, code, price, category }),
                    message: "Error Trying to create Product",
                    code: EErrors.INVALID_TYPE,
                    level: 3
                })
            } else {
                const response = await productModel.create({ title, description, stock, code, price, category })
                res.status(201).send({ status: true, product: response })
            }
        } catch (error) {
            next(error)
        }
    }

    putProduct = async (req, res, next) => { // Modifica un producto
        const { id } = req.params
        const { title, description, stock, code, price, category, status } = req.body

        try {
            const response = await productModel.findByIdAndUpdate(id, { title, description, stock, code, price, category, status }) //Retorna el objeto o null
            const product = await productModel.findById(id)

            if (response) {
                res.status(200).send({ status: true, product: product })
            } else {
                CustomError.createError({
                    name: "Put Product Error",
                    cause: "Product Not Found",
                    message: "El producto no se encuentra en la base de datos",
                    code: EErrors.DATABASE,
                    level: 3
                })
            }

        } catch (error) {
            next(error)
        }
    }

    deleteProduct = async (req, res, next) => {// Borra un producto
        const { id } = req.params

        try {
            const response = await productModel.findByIdAndDelete(id) //Retorna el objeto o null

            if (response) {
                res.status(200).send({ status: true, product: undefined })
            } else {
                CustomError.createError({
                    name: "Delete Product Error",
                    cause: "Product Not Found",
                    message: "El producto no se encuentra en la base de datos",
                    code: EErrors.DATABASE,
                    level: 3
                })
            }
        } catch (error) {
            next(error)
        }
    }
}