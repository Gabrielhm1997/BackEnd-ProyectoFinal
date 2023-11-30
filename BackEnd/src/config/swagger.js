import { __dirname } from "../path.js"

export const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Documentacion del curso de Backend',
            decription: 'API Coderhouse Backend'
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}