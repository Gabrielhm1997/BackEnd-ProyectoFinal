export default class CustomError {
    static createError ({name="Error", cause, message, code, level, status}){
        const error = new Error(message, {cause})
        error.name = name
        error.code = code
        error.level = level
        error.status = status
        throw error
    }
}