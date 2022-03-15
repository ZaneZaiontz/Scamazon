/* Requirements */
const express = require('express');
const router = express.Router();
const User = require('../models/user_model');

//register route: Gets register form
router.get('/register', (req, res) => {
	res.render('users/register');
});

//post for register route
/* router.post('/register', async (req, res) => {
	const { email, username, password } = req.body;
	const user = new User({ email, username });
	const registeredUser = await User.register(user, password);
	//req.flash('success', 'Welcome to Scamazon');
	res.redirect('/products');
}); */

//login route: Gets login form
router.get('/login', (req, res) => {
	res.render('users/login');
});

//post for login route
router.post('/login', (req, res) => {
	res.flash('success', 'Login successful.');
	res.redirect('/products');
});
module.exports = router;
