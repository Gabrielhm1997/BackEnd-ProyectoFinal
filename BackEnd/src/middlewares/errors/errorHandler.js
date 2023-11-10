


export const errorHandler = (error, req, res, next) => {
    console.log("Middleware 2")
    console.log(error) // -> Reemplazar por Looger


    switch (error.code) {
        case 1:
        case 2:
        case 3:
        case 4:
            console.log("1234")
            res.status(400).send({ error: error.name, cause: error.cause })
            break;

        default:
            console.log("Default")
            res.status(400).send({ error: error })
            break;
    }
}