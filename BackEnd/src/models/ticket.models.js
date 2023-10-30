import { Schema, model } from "mongoose"
import { v4 as uuidv4 } from 'uuid'

const ticketSchema = new Schema ({
    purchaser:{
        type: String,
        required: true
    },
    code: {
        type: String,
        default: uuidv4()
    },
    purchase_datetime:{
        type: Date,
        default: new Date()
    },
    amount:{
        type: Number,
        required: true
    }
})

const ticketModel = model('ticket', ticketSchema)

export default ticketModel