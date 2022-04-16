/* Requirements */
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateProduct } = require('../middleware');
const Cart = require('../models/cart_model');
const Product = require('../models/product_model');

/* Show cart */
router.get(
	'/',
	catchAsync(async (req, res) => {
		if (!req.session.cart) {
			return res.render('cart/view-cart', { products: null });
		}
		const cart = new Cart(req.session.cart);
		res.render('cart/view-cart', {
			products: cart.generateArray(),
			itemsPrice: cart.itemsPrice,
			totalPrice: cart.generateTotal()
		});
	})
);
/* Add to cart */
router.get(
	'/add-to-cart/:id',
	catchAsync(async (req, res) => {
		const product = await Product.findById(req.params.id).populate('author');
		const cart = new Cart(req.session.cart ? req.session.cart : { items: {} });
		if (!product) {
			req.flash('error', 'Cannot find that product');
			return res.redirect('/products');
		}
		cart.add(product, product._id);
		req.session.cart = cart;
		res.redirect(`/products/${product._id}`);
	})
);
/* Decrement quantity */
router.get(
	'/dec-qty/:id',
	catchAsync(async (req, res) => {
		const product = await Product.findById(req.params.id).populate('author');
		const cart = new Cart(req.session.cart);
		cart.decrease(product, product._id);
		req.session.cart = cart;
		if (cart.totalQty === 0) {
			delete req.session.cart;
		}
		res.redirect('/cart');
	})
);
/* Increment quantity */
router.get(
	'/inc-qty/:id',
	catchAsync(async (req, res) => {
		const product = await Product.findById(req.params.id).populate('author');
		const cart = new Cart(req.session.cart);
		cart.add(product, product._id);
		req.session.cart = cart;
		res.redirect('/cart');
	})
);

/* Remove item */
router.get(
	'/remove-item/:id',
	catchAsync(async (req, res) => {
		const product = await Product.findById(req.params.id).populate('author');
		const cart = new Cart(req.session.cart);
		cart.remove(product._id);
		req.session.cart = cart;
		if (cart.totalQty === 0) {
			delete req.session.cart;
		}
		req.flash('success', 'Item removed from cart.');
		res.redirect('/cart');
	})
);

/* Checkout */
router.get('/checkout', (req, res) => {
	const cart = new Cart(req.session.cart);
	res.render('cart/checkout', {
		itemsPrice: cart.itemsPrice,
		totalPrice: cart.generateTotal()
	});
});
module.exports = router;
