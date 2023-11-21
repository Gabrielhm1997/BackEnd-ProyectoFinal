import dotenv from 'dotenv'

const enviroment = "DEVELOPMENT"

dotenv.config({
    path: enviroment === "PRODUCTION" ? './.env.production' : './.env.development'
})

export default {
    MODE: process.env.MODE,
    MONGODB_ATLAS_API_KEY: process.env.MONGODB_ATLAS_API_KEY,
    SESSION_SECRET: process.env.SESSION_SECRET,
    SALT: process.env.SALT,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CALLBACK_URL: process.env.CALLBACK_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    LOGGS_PATH: process.env.LOGGS_PATH,
    NODEMAILER_USER: process.env.NODEMAILER_USER,
    NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD
}

