import { Router } from "express"
import { authorization, passportError } from "../utils/messageErrors.js"
import { mockController } from "../controllers/mock.controller.js"

import CustomError from "../services/errors/CustomError.js"
import EErrors from "../services/errors/enums.js"
import { generateUserErrorInfo, generateProductErrorInfo } from "../services/errors/info.js"



const routerTest = Router()
const controller = new mockController()

routerTest.get('/mockingusers', passportError('jwt'), authorization('admin'), controller.createRandomUser(100))

routerTest.get('/mockingproducts', passportError('jwt'), authorization('user'), controller.createRandomProduct(100))

routerTest.post('/errorUser', async (req, res) => {

    try {
        const { first_name, last_name, email, age } = req.body

        if (!first_name || !last_name || !email || !age) {

            CustomError.createError({
                name: "User creation Error",
                cause: generateUserErrorInfo({ first_name, last_name, email, age }),
                message: "Error Trying to create User",
                code: EErrors.INVALID_TYPE
            })
        } else {
            res.send("Succes")
        }
    } catch (error) {
        console.log(error)
        res.send({ error: error, cause: error.cause })
    }
})

// routerTest.use((req, res, next) => {
//     console.log("Middleware 1")
//     next()
// })

routerTest.get('/error', (req, res, next) => {

    const { error } = req.body

    try {

        if (error) {
            //throw new Error(error)
            CustomError.createError({
                name: "Test Error",
                cause: "Error: true",
                message: "Error in testing Area",
                code: EErrors.ROUTING
            })
        } else {
            res.send({ status: "Succes" })
        }

    } catch (error) {
        next(error)
    }
})

// routerTest.use((error, req, res, next) => {
//     console.log("Middleware 2")
//     console.log(error) // -> Reemplazar por Looger
//     res.send({ error: error })
// })

// routerTest.post('/errorProduct', async (req, res) => {

//     try {
//         const { title, description, stock, code, price, category } = req.body

//      if (!title || !description || !stock || !code || !price || !category) {

//          CustomError.createError({
//              name: "Product creation Error",
//              cause: generateProductErrorInfo({title, description, stock , code, price, category}),
//              message: "Error Trying to create Product",
//              code: EErrors.INVALID_TYPE
//          })
//      } else {
//          res.send("Succes")
//      }
//      } catch (error) {
//          console.log(error)
//          res.send({error: error, cause: error.cause})
//      }
//  })

export default routerTest