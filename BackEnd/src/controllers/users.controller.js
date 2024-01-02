import userModel from "../models/users.models.js"
import { generateToken } from "../utils/jwt.js"

import { sendRecoveryEmail } from "../config/nodemailer.js"
import { validatePassword, createHash } from "../utils/bcrypt.js"
import crypto from 'crypto'

import CustomError from "../services/errors/CustomError.js"
import EErrors from "../services/errors/enums.js"

export class usersController {
    constructor() {
        this.recoveryLinks = [{}]
    }

    postUser = async (req, res, next) => {
        try {
            if (!req.user) {
                //res.status(400).send({ status: false, mensaje: 'Usuario ya existente' })
                CustomError.createError({
                    name: 'Register Error',
                    cause: 'Usuario ya existente',
                    message: 'Yo existe un usuario registrado con ese email',
                    code: EErrors.DATABASE,
                    level: 3,
                })
            }

            const token = generateToken(req.user)

            res.cookie('jwtCookie', token, {
                httpOnly: true,
                maxAge: 43200000
            })
            res.status(201).send({ status: true, token: token })
        } catch (error) {
            //res.status(500).send({ mensaje: `Error al crear usuario ${error}` })
            next(error)
        }
    }

    postPasswordRecovery = async (req, res, next) => {
        const { email } = req.body

        try {

            const userFound = await userModel.findOne({ email: email })

            if (userFound) {
                const token = crypto.randomBytes(20).toString('hex')

                this.recoveryLinks[token] = { email, timestamp: Date.now() }

                const recoveryLink = `http://localhost:8080/api/users/reset-password/${token}`

                sendRecoveryEmail(email, recoveryLink)

                res.status(200).send('Correo de recuperacion enviado correctamente')
            } else {
                CustomError.createError({
                    name: 'Password Recovery Error',
                    cause: 'Usuario no registrado',
                    message: 'Error al buscar al Usuario en la base de datos, usuario no registrado',
                    code: EErrors.DATABASE,
                    level: 3,
                })
            }
        } catch (error) {
            next(error)
        }
    }

    postResetPassword = async (req, res, next) => {
        const { token } = req.params
        const { newPassword, email } = req.body
        try {
            //Verifico que el token es valido y no ha expirado (1 hora = 3600000)
            const linkData = this.recoveryLinks[token]

            if (linkData && linkData.email == email && Date.now() - linkData.timestamp <= 300000) {

                const userFound = await userModel.findOne({ email: linkData.email })
                const oldPassword = userFound.password
                const isValidPassword = validatePassword(newPassword, oldPassword) //Consulto si la nueva contraseña es distinta a la antigua

                if (!isValidPassword) {

                    userFound.password = createHash(newPassword)
                    await userFound.save()// Cambio de contraseña (modificar cliente)

                    delete this.recoveryLinks[token]
                    res.status(200).send('Contraseña modificada correctamente')
                } else {
                    CustomError.createError({
                        name: 'Password Reset Error',
                        cause: 'Contraseña no valida',
                        message: 'Error al cambiar la contraseña, la nueva contraseña debe ser diferente de la antigua',
                        code: EErrors.DATABASE,
                        level: 3,
                    })
                }
            } else {
                CustomError.createError({
                    name: 'Password Reset Error',
                    cause: 'Token invalido o expirado',
                    message: 'Token invalido o expirado. Por favor pruebe nuevamente',
                    code: EErrors.INVALID_TYPE,
                    level: 3,
                })
                //res.status(400).send('Token invalido o expirado. Pruebe nuevamente')
            }
        } catch (error) {
            delete this.recoveryLinks[token]
            next(error)
        }
    }

    postUploadDocument = async (req, res, next) => {

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

    getAllUsers = async (req, res, next) => {
        try {
            const rawUsers = await userModel.find()

            const users = rawUsers.map((rawUser) => {

                return {
                    first_name: rawUser.first_name,
                    last_name: rawUser.last_name ?? undefined,
                    email: rawUser.email,
                    rol: rawUser.rol,
                    age: rawUser.age
                }
            })

            res.status(200).send({ status: true, users: users })
        } catch (error) {
            next(error)
        }
    }

    deleteInactiveUsers = async (req, res, next) => {
        try {
            const rawUsers = await userModel.find()

            const currentDate = new Date()

            const filteredUsers = rawUsers.filter(rawUser =>  currentDate.getTime() - rawUser.last_connection.getTime() > 1800000 )//7200000

            console.log(filteredUsers)

            let i = 0
            
            const deleteFilterUsers = async () => {

                if(filteredUsers.length > i){
                    await userModel.findByIdAndRemove(filteredUsers[i]._id)
                    i++
                    deleteFilterUsers()
                }
            }

            deleteFilterUsers()

            res.status(200).send({ status: true, filteredUsers: filteredUsers })

        } catch (error) {
            next(error)
        }
    }
}