import { logger } from "../../utils/logger.js"

const errorLevel = (error) => {
    const date = new Date()
    switch (error.level) {
        case 0:
            logger.fatal(`[${date.toLocaleDateString()} - ${date.toLocaleTimeString()}] ${error}`)
            break;
        case 1:
            logger.error(`[${date.toLocaleDateString()} - ${date.toLocaleTimeString()}] ${error}`)
            break;
        case 2:
            logger.warning(`[${date.toLocaleDateString()} - ${date.toLocaleTimeString()}] ${error}`)
            break;
        case 3:
            logger.info(`[${date.toLocaleDateString()} - ${date.toLocaleTimeString()}] ${error}`)
            break;
        case 4:
            logger.http(`[${date.toLocaleDateString()} - ${date.toLocaleTimeString()}] ${error}`)
            break;
        case 5:
            logger.debug(`[${date.toLocaleDateString()} - ${date.toLocaleTimeString()}] ${error}`)
            break;

        default:
            logger.error(`[${date.toLocaleDateString()} - ${date.toLocaleTimeString()}] ${error}`)
            break;
    }
}

export const errorHandler = (error, req, res, next) => {
    const resStatus = error.status
    errorLevel(error)
    switch (error.code) {
        case 1:
        case 2:
        case 3:
        case 4:
            res.status(resStatus ?? 400).send({ error: error.name, message: error.message, cause: error.cause})
            break;

        default:
            res.status(resStatus ?? 400).send({ error: error, message: error.message})
            break;
    }
}