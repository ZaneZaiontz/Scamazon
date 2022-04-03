/* Requirements */
const express = require('express');
const router = express.Router();
const User = require('../models/user_model');
/* 3/29 - added the following requirements */
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
//register route: Gets register form
router.get('/register', (req, res) => {
	res.render('users/register');
});

//handle register logic
router.post(
	'/register',
	catchAsync(async (req, res, next) => {
		try {
			const { username, password } = req.body;
			const user = new User({ username });
			/* 3/29 */
			//Check if the admin code field matches the admin code
			//If they match, set isAdmin = true
			if (req.body.adminCode === 'sp22ScamazonAdminCode') {
				user.isAdmin = true;
			}
			const registeredUser = await User.register(user, password);
			/* 3/30 - added log in method from passport. once a user registers this will log them in */
			req.login(registeredUser, (err) => {
				if (err) return next(err);
				req.flash('success', 'Welcome to Scamazon!');
				res.redirect('/products');
			});
		} catch (e) {
			req.flash('error', e.message);
			res.redirect('/register');
		}
	})
);

//login route: Gets login form
router.get('/login', (req, res) => {
	res.render('users/login');
});

//post for login route
/* 3/29 */
/* Verify's the credentials.
	- if correct - will flash a success message and redirect to products page
	- if incorrect - will flash an error message and redirect to login page \
*/
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
	req.flash('success', 'Welcome back!');
	/* 3/30 - once logged in, either redirect user to the url they're requesting or to products page */
	const redirectUrl = req.session.returnTo || '/products';
	//delete redirctURL from the session
	delete req.session.returnTo;
	res.redirect(redirectUrl);
});

//Logic for logging out. Will redirect user to products page once logged out
/* 3/30 - added logout route */
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'Logged out.');
	res.redirect('/products');
});

router.get('/profile', (req, res) => {
	res.render('users/profile');
});

module.exports = router;
