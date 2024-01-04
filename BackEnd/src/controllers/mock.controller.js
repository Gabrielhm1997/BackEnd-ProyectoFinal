import { faker } from '@faker-js/faker'
import { v4 as uuidv4 } from 'uuid'

export class mockController {
    constructor() { }

    modelUser = () => {
        return {
            _id: faker.database.mongodbObjectId(),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            rol: "user",
            age: faker.number.int({ min: 18, max: 100 }),
            cart: faker.database.mongodbObjectId()
        }
    }

    modelProduct = () => {
        return {
            _id: faker.database.mongodbObjectId(),
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price({ min: 1000, max: 5000 }),
            stock: faker.number.int({ min: 10, max: 100 }),
            category: this.randomCategory(),
            status: true,
            code: uuidv4(),
            thumbnails: []
        }
    }

    randomCategory = () => {

        const i = faker.number.int({ min: 1, max: 3 })

        switch (i) {
            case 1: return "Computacion"
            case 2: return "Alimentos"
            case 3: return "Hogar"
        }
    }

    createRandomUser = (quantity) => {
        return async (req, res, next) => {
            try {
                const testUsers = []
                for (let i = 0; i < quantity; i++) {
                    testUsers.push(this.modelUser())
                }
                res.status(200).send({ status: true, testUsers: testUsers })
            } catch (error) {
                next(error)
            }
        }
    }

    createRandomProduct = (quantity) => {
        return async (req, res, next) => {
            try {
                const testProducts = []
                for (let i = 0; i < quantity; i++) {
                    testProducts.push(this.modelProduct())
                }
                res.status(200).send({ status: true, testProducts: testProducts })
            } catch (error) {
                next(error)
            }
        }
    }
}