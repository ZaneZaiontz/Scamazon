const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Product = require('../models/product_model');
const { isLoggedIn, isAuthor, validateProduct } = require('../middleware');

/* manage products route */
router.get(
	'/manageProducts',
	catchAsync(async (req, res) => {
		const products = await Product.find({}).populate('author');
		res.render('admin/manageProducts', { products });
	})
);

/* New product route */
router.post(
	'/',
	isLoggedIn,
	validateProduct, //Call to validate the new data
	catchAsync(async (req, res) => {
		const product = new Product(req.body.product);
		product.author = req.user._id;
		await product.save();
		req.flash('success', 'Successfully made a new product!');
		res.redirect('admin/manageProducts');
	})
);

/* Update product route */
router.put(
	'/:id',
	isLoggedIn,
	isAuthor,
	validateProduct, //Call to validate updated data
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
		req.flash('success', 'Successfully updated product!');
		res.redirect('/admin/manageProducts');
	})
);
/* Delete product route */
router.delete(
	'/:id',
	isLoggedIn,
	isAuthor,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Product.findByIdAndDelete(id);
		req.flash('success', 'Successfully deleted product');
		res.redirect('/admin/manageProducts');
	})
);

module.exports = router;
