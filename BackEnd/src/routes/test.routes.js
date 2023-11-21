import enviroment from "../config/enviroment.js"
import { Router } from "express"
import { authorization, passportError } from "../utils/messageErrors.js"
import { mockController } from "../controllers/mock.controller.js"

import CustomError from "../services/errors/CustomError.js"
import EErrors from "../services/errors/enums.js"
import { generateUserErrorInfo, generateProductErrorInfo } from "../services/errors/info.js"



const routerTest = Router()
const controller = new mockController()

routerTest.get('/mockingusers', passportError('jwt'), authorization(['admin']), controller.createRandomUser(100))

routerTest.get('/mockingproducts', passportError('jwt'), authorization(['admin']), controller.createRandomProduct(100))

routerTest.get('/loggerTest', async (req, res, next) => {

    const { level } = req.body

    try {
        switch (enviroment.MODE) {
            case "PRODUCTION":
                CustomError.createError({
                    name: "Production Error",
                    cause: "Testeo de Logger de produccion",
                    message: "Production Error Testing",
                    code: EErrors.INVALID_TYPE,
                    level: level ?? 1,
                    status: 400
                })
                break;
        
            default:
                CustomError.createError({
                    name: "Development Error",
                    cause: "Testeo de Logger de desarrollo",
                    message: "Development Error Testing",
                    code: EErrors.INVALID_TYPE,
                    level: level ?? 1,
                    status: 400
                })
                break;
        }
        res.send('Por favor envie el nivel del error [1-5] por el body, bajo el nombre de "level"')
    } catch (error) {
        next(error)
    }
})

routerTest.get('/rolTest',passportError('jwt'), authorization(['user', 'premium']), async (req, res) => {
    res.send(`Bienvenido: ${req.user.rol}`)
})

// routerTest.post('/errorUser', async (req, res, next) => {

//     try {
//         const { first_name, last_name, email, age } = req.body

//         if (!first_name || !last_name || !email || !age) {

//             CustomError.createError({
//                 name: "User creation Error",
//                 cause: generateUserErrorInfo({ first_name, last_name, email, age }),
//                 message: "Error Trying to create User",
//                 code: EErrors.INVALID_TYPE,
//                 level: 2,
//                 status: 400
//             })
//         } else {
//             res.send("Succes")
//         }
//     } catch (error) {
//         next(error)
//     }
// })

// routerTest.get('/error', (req, res, next) => {

//     const { error } = req.body

//     try {

//         if (error) {
//             //throw new Error("Error salvaje aparece!")
//             CustomError.createError({
//                 name: "Test Error",
//                 cause: "True Error",
//                 message: "Error in testing Area",
//                 code: EErrors.ROUTING,
//                 level: 2,
//                 status: 401
//             })
//         } else {
//             res.send({ status: "Succes" })
//         }

//     } catch (error) {
//         next(error)
//     }
// })

export default routerTest