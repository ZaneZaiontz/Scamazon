const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        cart: {
            type: Object,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: 'new',
        },
        total: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
