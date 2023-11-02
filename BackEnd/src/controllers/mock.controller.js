import { faker } from '@faker-js/faker'


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

    createRandomUser = (quantity) => {
        return async (req, res) => {
            try {
                const testUsers = []

                for (let i = 0; i < quantity; i++) {
                    testUsers.push(this.modelUser())
                }

                res.status(200).send({ status: true, testUsers: testUsers })
            } catch (error) {
                console.log(error)
                res.status(400).send({ status: false, error: error })
            }
        }
    }
}