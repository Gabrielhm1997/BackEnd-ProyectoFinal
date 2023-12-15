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

export const uploader = async (req, res, next) => {

    try {

        if (!req.files) {
            CustomError.createError({
                name: "File Upload Error",
                cause: "Error de Multer",
                message: "Error Trying to upload File",
                code: EErrors.INVALID_TYPE,
                level: 2
            })
        }
        const uploadedDocuments = req.files
        const user = await userModel.findById(req.user.id)
        const userDocuments = user.documents ?? []
        let i = 0

        const updateUserDocuments = async () => {

            if (i < uploadedDocuments.length) {

                const newDocument = {
                    originalname: uploadedDocuments[i].originalname,
                    name: uploadedDocuments[i].filename,
                    reference: uploadedDocuments[i].path
                }
                const documentFound = userDocuments.find(document => document.originalname == newDocument.originalname)
                console.log(documentFound)
                if (documentFound) {
                    i++
                    updateUserDocuments()
                } else {
                    userDocuments.push(newDocument)
                    await userModel.findByIdAndUpdate(req.user.id, { documents: userDocuments })
                    i++
                    updateUserDocuments()
                }
            }
        }
        updateUserDocuments()
        res.status(200).send("Archivo/s subido")
    } catch (error) {
        next(error)
    }
}