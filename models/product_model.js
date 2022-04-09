const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true,
		min: 0
	},
	discountCode: {
		type: String
	},
	quantity: {
		type: Number,
		required: true,
		min: 0
	},
	description: {
		type: String,
		required: true
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
});

//Compile model
const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
