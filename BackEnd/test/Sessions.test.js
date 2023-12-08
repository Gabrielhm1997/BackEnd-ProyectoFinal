import enviroment from "../src/config/enviroment.js"
import mongoose from "mongoose"
import supertest from 'supertest'
import chai from 'chai'
import userModel from "../src/models/users.models.js"

const expect = chai.expect
const requester = supertest('http://localhost:8080')

await mongoose.connect(enviroment.MONGODB_ATLAS_API_KEY)
    .then(() => console.log("DB Conected"))

describe('Test de Sessiones', () => {

    let newUserTest
    let tokenUserTest
    let idUserTest
    let emailTest = "test@test.com"
    let passwordTest = "test"

    before(()=>{
        newUserTest = {
            first_name: "Test",
            last_name: "Osterona",
            age: 26,
            email: emailTest,
            password: passwordTest
        }
    })

    it('Test endpoint POST /api/users, se espera que se cree un usuario y se devuelva su token', async () => {
        const{ _body, statusCode} = await requester.post(`/api/users`).send(newUserTest)
        expect(statusCode).to.equal(201)
        console.log(_body)
    })

    it('Test endpoint POST /api/sessions/login, se espera que loguee un usuario y se devuelva su token', async () => {
        const{ _body, statusCode} = await requester.post(`/api/sessions/login`).send({email: emailTest, password: passwordTest})
        tokenUserTest = _body.token
        expect(statusCode).to.equal(200)
        console.log(_body)
    })

    it('Test endpoint GET /api/sessions/current, se espera que devuelva los datos del usuario', async () => {
        const{ _body, statusCode} = await requester.get(`/api/sessions/current`).auth(tokenUserTest, { type: 'bearer' })
        idUserTest = _body.user.id
        expect(statusCode).to.equal(200)
        expect(_body.user.email).to.equal(emailTest)
        console.log(_body)
    })

    after(async () => {
        await userModel.findByIdAndDelete(idUserTest)
    })
})