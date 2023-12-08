import enviroment from "../src/config/enviroment.js"
import mongoose from "mongoose"
import supertest from 'supertest'
import chai from 'chai'
import { generateToken } from "../src/utils/jwt.js"

const expect = chai.expect
const requester = supertest('http://localhost:8080')

await mongoose.connect(enviroment.MONGODB_ATLAS_API_KEY)
    .then(() => console.log("DB Conected"))


describe('Test de manipulacion de Productos', () => {

    let adminTest
    let tokenTest
    let pidTest
    let productCodeTest = "teclado-test-986532"

    before(async () => {
        adminTest = {
            rol: "admin"
        }
        tokenTest = generateToken(adminTest)
    })

    it('Test endpoint POST /api/products, se espera la creación de un producto', async () => {
        const newProduct = {
            title: "teclado",
            description: "Razer",
            price: 8500,
            stock: 10,
            category: "computacion",
            code: productCodeTest
        }
        const { _body, statusCode } = await requester.post('/api/products').auth(tokenTest, { type: 'bearer' }).send(newProduct)
        pidTest = _body.product._id
        expect(statusCode).to.equal(201)
        expect(_body.product).to.have.property("_id")
    })

    it('Test endpoint PUT /api/products/:id, se espera que actualice un producto', async () => {
        const newPrice = 7500
        const updateProduct = {
            price: newPrice
        }
        const { _body, statusCode } = await requester.put(`/api/products/${pidTest}`).auth(tokenTest, { type: 'bearer' }).send(updateProduct)
        expect(statusCode).to.equal(200)
        expect(_body.product.price).to.equal(newPrice)
    })

    it('Test endpoint GET /api/products/:id, se espera que devuelva el producto correspondiente al codigo de prueba', async () => {
        const { _body, statusCode } = await requester.put(`/api/products/${pidTest}`).auth(tokenTest, { type: 'bearer' })
        expect(statusCode).to.equal(200)
        expect(_body.product.code).to.equal(productCodeTest)
        console.log(_body.product)
    })

    it('Test endpoint DELETE /api/products/:id, se espera que elimine el producto', async () => {
        const { _body, statusCode } = await requester.delete(`/api/products/${pidTest}`).auth(tokenTest, { type: 'bearer' })
        expect(statusCode).to.equal(200)
        expect(_body.product).to.equal(undefined)
    })

})