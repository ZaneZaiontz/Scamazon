/* Requirements */
const express = require('express');
const router = express.Router();
const User = require('../models/user_model');



//register route: Gets register form
router.get('/register', (req, res) => {
	res.render('users/register');
});

//post for register route
router.post('/register', async (req, res) => {
	if (!req.user){
		const { email, username, password } = req.body;
		const user = new User({ email, username });
		const registeredUser = await User.register(user, password);
		//req.flash('success', 'Welcome to Scamazon');
		res.redirect('/');
	} else {
		res.redirect('/profile');
	}
});

//login route: Gets login form
router.get('/login', (req, res) => {
	res.render('users/login');
});

// MOVED TO: app.js
//post for login route
/* router.post('/login', (req, res) => {
	//res.flash('success', 'Login successful.');
	res.redirect('/profile');
}); */


router.get('/profile', (req, res) => {
	if (req.user)
		res.render("users/profile", {user: req.user});
	else
		res.redirect("/login");

});
router.post('/profile', (req, res) => {
	res.redirect('/profile');
});

module.exports = router;
