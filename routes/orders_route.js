/* Requirements */
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateProduct } = require('../middleware');
const Order = require('../models/order_model');
const Product = require('../models/product_model');

router.get(
	'/',
	catchAsync(async (req, res, next) => {
		const order = await Order.find().select('product quantity _id').populate('product');
		if (!order) {
			req.flash('error', 'Cannot find that order');
			return res.redirect('/');
		}
		res.status(200).json({
			order: order
		});
	})
);
router.post(
	'/',
	catchAsync((req, res, next) => {
		const product = Product.findById(req.body.productId);
		if (!product) {
			req.flash('error', 'Cannot find that product');
			return res.status(404).json({
				message: 'product not found'
			});
		}
		const order = new Order({
			quantity: req.body.quantity,
			product: req.body.productId
		});
		order
			.save()
			.then((result) => {
				console.log(result);
				res.status(201).json(result);
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({
					error: err
				});
			});
	})
);
