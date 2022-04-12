const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Product = require('../models/product_model');

/* manage products route */
router.get(
	'/manageProducts',
	catchAsync(async (req, res) => {
		const products = await Product.find({}).populate('author');
		res.render('admin/manageProducts', { products });
	})
);

module.exports = router;
