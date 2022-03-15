/* Requirements */
const express = require('express');
const router = express.Router();
const Product = require('../models/product_model');
const { productSchema } = require('../schemas.js');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

//Error handler. Validates if the correct data is being used
const validateProduct = (req, res, next) => {
	const { error } = productSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

//products page route: will display all products
router.get(
	'/',
	catchAsync(async (req, res) => {
		const products = await Product.find({});
		res.render('products/index', { products });
	})
);

//new product route: page to create a new product
router.get('/new', (req, res) => {
	res.render('products/new');
});

//post route for new product: adds the new product to the database
//and will redirect the user to the newly created product
router.post(
	'/',
	validateProduct, //Call to validate the new data
	catchAsync(async (req, res) => {
		const product = new Product(req.body.product);
		await product.save();
		req.flash('success', 'Successfully made a new product!');
		res.redirect(`/products/${product._id}`);
	})
);

//product details route: will display a product's details
router.get(
	'/:id',
	catchAsync(async (req, res) => {
		const product = await Product.findById(req.params.id);
		if (!product) {
			req.flash('error', 'Cannot find that product');
			return res.redirect('/products');
		}
		res.render('products/show', { product });
	})
);

//edit product route: page to edit a product
router.get(
	'/:id/edit',
	catchAsync(async (req, res) => {
		const product = await Product.findById(req.params.id);
		if (!product) {
			req.flash('error', 'Cannot find that product');
			return res.redirect('/products');
		}
		res.render('products/edit', { product });
	})
);

//put route for editing product: updates the product in the database
//and will redirect the user to the updated product
router.put(
	'/:id',
	validateProduct, //Call to validate updated data
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
		req.flash('success', 'Successfully updated product!');
		res.redirect(`/products/${product._id}`);
	})
);

//delete route: deletes the product
router.delete(
	'/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Product.findByIdAndDelete(id);
		req.flash('success', 'Successfully deleted product');
		res.redirect('/products');
	})
);

module.exports = router;
