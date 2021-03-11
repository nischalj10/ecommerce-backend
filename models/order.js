const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {ObjectId} = mongoose.Schema

const orderSchema = new mongoose.Schema({
    products : [
        {
            product : {
                type: ObjectId,
                ref : 'Product'
            },
            count : Number,
            color: String,
        }
    ],

    paymentIntent : {},

    orderStatus : {
        type : String,
        default: 'Not processed yet',
        enum : [
            "Not processed yet",
            "Processing",
            "Dispatched",
            "Cancelled",
            "Delivered",
            "Cash On Delivery",
        ]
    },

    orderedBy : {type: ObjectId, ref: "User"},

}, {timestamps : true})

module.exports = mongoose.model("Order", orderSchema);