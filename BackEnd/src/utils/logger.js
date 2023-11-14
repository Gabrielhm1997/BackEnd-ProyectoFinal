import enviroment from "../config/enviroment.js"
import winston from "winston"

const customLevelOption = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'yellow',
        warning: 'magenta',
        info: 'blue',
        http: 'green',
        debug: 'white'
    }
}

const productionLogger = () => {

    return winston.createLogger({
        levels: customLevelOption.levels,
        transports: [
            new winston.transports.Console({
                level: 'info',
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevelOption.colors }),
                    winston.format.simple()
                )
            }),
            new winston.transports.File({
                filename: enviroment.LOGGS_PATH,
                level: 'info',
                format: winston.format.simple()
            })
        ]
    })

}

const devLogger = () => {
    return winston.createLogger({
        levels: customLevelOption.levels,
        transports: [
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevelOption.colors }),
                    winston.format.simple()
                )
            })
        ]
    })
}

export const logger = enviroment.MODE === "PRODUCTION" ? productionLogger() : devLogger()