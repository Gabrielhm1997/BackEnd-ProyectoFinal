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
    },
    purchased_products: {
        type: [
            {
                id_prod: {
                    type: Schema.Types.ObjectId,
                    ref: 'inventory',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        default: function () {
            return []
        }
    }
})

ticketSchema.pre('findOne', function () {
    this.populate('products.id_prod')
})

const ticketModel = model('ticket', ticketSchema)

export default ticketModel