import enviroment from "../src/config/enviroment.js"
import mongoose from "mongoose"
import supertest from 'supertest'
import chai from 'chai'
import cartModel from "../src/models/cart.models.js"
import productModel from "../src/models/products.models.js"
import { generateToken } from "../src/utils/jwt.js"

const expect = chai.expect
const requester = supertest('http://localhost:8080')

await mongoose.connect(enviroment.MONGODB_ATLAS_API_KEY)
    .then(() => console.log("DB Conected"))

describe('Test de funcionamiento de Carts', () => {

    let userTest
    let cartTest
    let tokenTest
    let cartIdTest
    let productTest1
    let codeProductTest1 = "teclado-test-1"
    let iDProductTest1
    let productTest2
    let codeProductTest2 = "mouse-test-2"
    let iDProductTest2

    before(async () => {
        userTest = {
            rol: "user"
        }
        tokenTest = generateToken(userTest)

        cartTest = await cartModel.create({})
        cartIdTest = cartTest._id

        const newProductTest1 = {
            title: "teclado",
            description: "Test",
            price: 5000,
            stock: 10,
            category: "computacion",
            code: codeProductTest1
        }

        const newProductTest2 = {
            title: "mouse",
            description: "Test",
            price: 4500,
            stock: 10,
            category: "computacion",
            code: codeProductTest2
        }

        productTest1 = await productModel.create(newProductTest1)
        iDProductTest1 = productTest1._id

        productTest2 = await productModel.create(newProductTest2)
        iDProductTest2 = productTest2._id

        cartTest.products.push({id_prod: iDProductTest2, quantity: 6})
        await cartTest.save()

    })

    it('Test endpoint POST /api/carts/:cid/products/:pid, se espera que agrege un producto al carrito', async () => {
        const { _body, statusCode } = await requester.post(`/api/carts/${cartIdTest}/products/${iDProductTest1}`).auth(tokenTest, { type: 'bearer' }).send({ quantity: 2 })
        expect(statusCode).to.equal(200)
        expect(_body.products).to.be.a("array")
        console.log(_body)
    })

    it('Test endpoint PUT /api/carts/:cid/products/:pid, se espera que se modifique la cantidad de un producto del carrito', async () => {
        const { _body, statusCode } = await requester.put(`/api/carts/${cartIdTest}/products/${iDProductTest1}`).auth(tokenTest, { type: 'bearer' }).send({ quantity: 5 })
        expect(statusCode).to.equal(200)
        expect(_body.products).to.be.a("array")
        expect(_body.products[1].quantity).to.equal(5)
        console.log(_body)
    })

    it('Test endpoint GET /api/carts/:cid, se espera que devuelva los productos de un carrito', async () => {
        const { _body, statusCode } = await requester.get(`/api/carts/${cartIdTest}`).auth(tokenTest, { type: 'bearer' }).send({ quantity: 5 })
        expect(statusCode).to.equal(200)
        expect(_body.products).to.be.a("array")
        console.log(_body)
    })

    it('Test endpoint DELETE /api/carts/:cid/products/:pid, se espera que se elimine un producto del carrito', async () => {
        const { _body, statusCode } = await requester.delete(`/api/carts/${cartIdTest}/products/${iDProductTest1}`).auth(tokenTest, { type: 'bearer' })
        expect(statusCode).to.equal(200)
        expect(_body.products).to.be.a("array")
        console.log(_body)
    })

    after(async () => {
        await cartModel.findByIdAndDelete(cartIdTest)
        await productModel.findByIdAndDelete(iDProductTest1)
        await productModel.findByIdAndDelete(iDProductTest2)
    })
})