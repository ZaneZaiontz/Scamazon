const { productSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Product = require('./models/product_model');

/* 3/30 - Middleware to check if user is signed in. If not, redirect to login page */
module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		/* 3/30 - store the url a user is requesting */
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'You must be signed in.');
		return res.redirect('/login');
	}
	next();
};

//Error handler. Validates if the correct data is being used
module.exports.validateProduct = (req, res, next) => {
	const { error } = productSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

//3/30 - added middleware to check if the current user is the author or admin
module.exports.isAuthor = async (req, res, next) => {
	const { id } = req.params;
	const product = await Product.findById(id);
	if (product.author.equals(req.user._id) || req.user.isAdmin) {
		next();
	} else {
		req.flash('error', 'You do not have permission to do that.');
		return res.redirect(`/products/${id}`);
	}
};
