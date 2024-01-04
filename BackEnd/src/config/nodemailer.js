import enviroment from './enviroment.js'
import CustomError from '../services/errors/CustomError.js'
import EErrors from '../services/errors/enums.js'
import nodemailer from 'nodemailer'

const tranporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: enviroment.NODEMAILER_USER,
        pass: enviroment.NODEMAILER_PASSWORD,
        authMethod: 'LOGIN'
    }
})
// Funciones nodemailer

export const sendRecoveryEmail = (email, recoveryLink) => {

    const mailOptions = {
        from: enviroment.NODEMAILER_USER,
        to: email,
        subject: 'Link de recuperacion de su contraseña',
        text: `Copie el siguiente link en POSTMAN, metodo POST, y envie la nueva contraseña ("newPassword":) por el Body: ${recoveryLink}`
    }

    tranporter.sendMail(mailOptions, (error, info) => {
        if (error)
            console.log(error)
        else
            console.log('Email enviado correctamente')
    })
}

export const sendDeletedUserEmail = (email) => {

    const mailOptions = {
        from: enviroment.NODEMAILER_USER,
        to: email,
        subject: 'Usuario eliminado por inactividad',
        text: 'Le informamos que su usuario ha sido eliminado debido a un largo periodo de inactividad'
    }

    tranporter.sendMail(mailOptions, (error, info) => {
        if (error)
            console.log(error)
        else
            console.log('Email enviado correctamente')
    })
}