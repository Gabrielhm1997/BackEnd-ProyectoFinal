import enviroment from './config/enviroment.js'
import cors from 'cors'
import express from 'express'
import session from "express-session"
//import { engine } from 'express-handlebars'
import cookieParser from "cookie-parser"
import passport from "passport"
import mongoose from 'mongoose'
import MongoStore from "connect-mongo"
import { Server } from 'socket.io'
import router from './routes/index.routes.js'
//import routerViews from './routes/views.routes.js'
import initializePassport from "./config/passport.js"
import { errorHandler } from './middlewares/errors/errorHandler.js'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'
import { swaggerOptions } from './config/swagger.js'
 
const whiteList = ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:3000']

const corsOption = {
    origin: function (origin, callback){
        if(whiteList.indexOf(origin) != -1 || !origin){
            callback(null, true)
        } else {
            callback (new Error("Acceso denegado"))
        }
    }
}
const PORT = 3000
//export default PORT
const app = express()

app.use(cors(corsOption))

// Conexion a Mongodb Atlas
mongoose.connect(enviroment.MONGODB_ATLAS_API_KEY)
    .then(() => console.log("DB connected"))
    .catch(error => console.log(error))

// Server socket.io
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

const io = new Server(server)

//Swagger
const specs = swaggerJSDoc(swaggerOptions)

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(enviroment.JWT_SECRET))
app.use(session({
    store: MongoStore.create({
        mongoUrl: enviroment.MONGODB_ATLAS_API_KEY,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 90
    }),
    secret: enviroment.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))
// app.engine('handlebars', engine())
// app.set('view engine', 'handlebars')
app.set('views', 'src/views')
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//Routes
app.use ('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))
app.use('/static', express.static('src/public')) // Rutas publicas
//app.use('/static', routerViews) // Ruta de vistas Handlebars
app.use('/api', router) // Router de las rutas "API"
app.use(errorHandler)

app.get('*', (req, res) => {
    res.status(404).send("Error 404")
})