import enviroment from './enviroment'
import CustomError from '../services/errors/CustomError'
import EErrors from '../services/errors/enums'
import nodemailer from 'nodemailer'

const tranporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: enviroment.NODEMAILER_USER,
        pass: enviroment.NODEMAILER_PASSWORD
    }
})

// Funciones nodemailer

export const sendRecoveryEmail = (email, recoveryLink) => {
    const mailOptions = {
        from: enviroment.NODEMAILER_USER,
        to: email,
        subject: 'Link de recuperacion de su contraseña',
        text: `Ingrese al siguiente link para restablecer su contraseña: ${recoveryLink}`
    }

    tranporter.sendMail(mailOptions, (error, info) => {
        if (error)
            console.log(error)
        else
            console.log('Email enviado correctamente')
    })
}