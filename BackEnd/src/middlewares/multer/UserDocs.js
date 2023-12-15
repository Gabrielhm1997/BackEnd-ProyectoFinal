import multer from 'multer'
import userModel from '../../models/users.models.js'
import CustomError from '../../services/errors/CustomError.js'
import EErrors from '../../services/errors/enums.js'

const ruta = 'src/public/docs/users'
let filename

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, ruta)
    },
    filename: (req, file, cb) => {
        filename = `${Date.now()}${file.originalname}`
        cb(null, filename)
    }
})

export const upload = multer({ storage: storage })