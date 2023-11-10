// import { config } from "dotenv"
// config({ path: process.ENV })
import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import session from "express-session"
import { engine } from 'express-handlebars'
import cookieParser from "cookie-parser"
import passport from "passport"
import mongoose from 'mongoose'
import MongoStore from "connect-mongo"
import { Server } from 'socket.io'
import router from './routes/index.routes.js'
import routerViews from './routes/views.routes.js'
import initializePassport from "./config/passport.js"
import { errorHandler } from './middlewares/errors/errorHandler.js'

const whiteList = ['http://localhost:5173']

const corsOption = {
    origin: function (origin, callback){
        if(whiteList.indexOf(origin) != -1 || !origin){
            callback(null, true)
        } else {
            callback (new Error("Acceso denegado"))
        }
    }
}

const PORT = 8080
//export default PORT
const app = express()

//app.use(cors(corsOption))

// Conexion a Mongodb Atlas
mongoose.connect(process.env.MONGODB_ATLAS_API_KEY)
    .then(() => console.log("DB connected"))
    .catch(error => console.log(error))

// Server socket.io
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

const io = new Server(server)

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.JWT_SECRET))
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_ATLAS_API_KEY,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 90
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', 'src/views')
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//Routes
app.use('/static', express.static('src/public')) // Rutas publicas
app.use('/static', routerViews) // Ruta de vistas Handlebars
app.use('/api', router) // Router de las rutas "API"
app.use(errorHandler)

app.get('*', (req, res) => {
    res.status(404).send("Error 404")
})