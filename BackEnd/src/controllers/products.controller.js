import productModel from "../models/products.models.js"

export class productsController {
    constructor() { }

    getProducts = async (req, res) => {
        // ?type=title&query=teclado&limit=3&page=1&sort=desc
        const { limit, page, sort, type, query } = req.query

        let queryType = ""

        if (type && query) {
            queryType = JSON.parse(`{ "${type}": "${query}"  }`) // Formato de la query
        }

        try {
            const inventory = await productModel.paginate(queryType, { limit: limit ?? 10, page: page ?? 1, sort: { price: sort } })
            const response = { status: true, ...inventory }
            res.status(200).send(response)
        } catch (error) {
            res.status(400).send({ status: false, error: error })
        }
    }

    getProductByID = async (req, res) => {
        
        const { id } = req.params

        try {
            const product = await productModel.findById(id) //Retorna el objeto o null
            if (product) {
                res.status(200).send(product)
            } else {
                res.status(404).send(`Not Found`)
            }
        } catch (error) {
            res.status(400).send(`Error checking inventory: ${error}`)
        }
    }

    postProduct = async (req, res) => {
        const { title, description, stock, code, price, category } = req.body

        try {
            const response = await productModel.create({ title, description, stock, code, price, category }) // Devuelve el objeto creado 
            res.status(200).send(`Product created successfully`)
        } catch (error) {                                                                                    // Cualquier tipo de error lo captura el Catch
            res.status(400).send(`Error creating product: ${error}`)
        }
    }

    putProduct = async (req, res) => {
        const { id } = req.params
        const { title, description, stock, code, price, category, status } = req.body

        try {
            const response = await productModel.findByIdAndUpdate(id, { title, description, stock, code, price, category, status }) //Retorna el objeto o null

            if (response) {
                res.status(200).send(`Product updated successfully`)
            } else {
                res.status(404).send(`Not Found`)
            }

        } catch (error) {
            res.status(400).send(`Error updating product: ${error}`)
        }
    }

    deleteProduct = async (req, res) => {
        const { id } = req.params

        try {
            const response = await productModel.findByIdAndDelete(id) //Retorna el objeto o null

            if (response) {
                res.status(200).send(`Product deleted successfully`)
            } else {
                res.status(404).send(`Not Found`)
            }
        } catch (error) {
            res.status(400).send(`Error deleting product: ${error}`)
        }
    }
}