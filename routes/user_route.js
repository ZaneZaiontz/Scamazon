/* Requirements */
const express = require('express');
const router = express.Router();
const User = require('../models/user_model');
const Product = require('../models/product_model');
/* 3/29 - added the following requirements */
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

const { isLoggedIn } = require('../middleware');

//register route: Gets register form
router.get('/register', (req, res) => {
    res.render('users/register');
});

// router.get('/profile', (req, res) => { Deprecated
//     res.render('profile/profile');
// });

//handle register logic
router.post(
    '/register',
    catchAsync(async(req, res, next) => {
        try {
            const { username, password } = req.body;

            // username must be between 5 and 15 characters
            // and only contain letters
            if (!username.match("^[a-zA-z]{5,15}$")) {
                req.flash('error', 'Invalid Username');
                res.redirect('/register');
                return;
            }

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
	- if correct - will flash a success message and redirect to profile page
	- if incorrect - will flash an error message and redirect to login page \
*/
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back!');
    /* 3/30 - once logged in, either redirect user to the url they're requesting or to products page */
    const redirectUrl = req.session.returnTo || '/profile';
    //delete redirctURL from the session
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

//Logic for logging out. Will redirect user to home page once logged out
/* 3/30 - added logout route */
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged out.');
    res.redirect('/');
});

router.get('/profile', (req, res) => {
    // if (req.user.isAdmin === false)
    // 	res.render('users/profile');
    // else
    // 	res.redirect('/admin_tools');
    res.render('users/profile');
});

// Caleb: GET request to render the manage_profile page
router.get('/manage_profile', catchAsync(async(req, res) => {

    const user = await User.findById(req.user.id);

    res.render('users/manage_profile', { user });
}));
// Caleb: update username
router.put('/manage_profile', isLoggedIn, catchAsync(async(req, res) => {

    const user = await User.findByIdAndUpdate(req.user._id, {...req.body.user });

    req.flash('success', 'Successfully updated user information! Log back in view changes.');
    res.redirect('/');
}));

// Caleb: renders the change password page and sends the user information to the page
router.get('/change_password', catchAsync(async(req, res) => {

    const user = await User.findById(req.user.id);

    res.render('users/change_password', {user});
}));
// Caleb: finds the current user and verifies the old password - if correct, changes password
router.put('/change_password', isLoggedIn, catchAsync(async(req, res) => {

    const user = await User.findById(req.user.id);

    user.changePassword(req.body.old, req.body.new, function(err, user){
        if (err){
            req.flash('error', 'Incorrect old password');
            res.redirect('/change_password');
        } else {
            req.flash('success', 'Successfully changed your password!');
            res.redirect('/profile');
        }
    }); 
}));


// Caleb: GET request to render the user_products page
// user_products page will display each product they sell
router.get('/user_products', catchAsync(async(req, res) => {
    const products = await Product.find({ author: req.user._id });
    res.render('users/user_products', { products });
}));
// Caleb: GET request to render the user_orders page
router.get('/user_orders', (req, res) => {
    res.render('users/user_orders');
});
// Caleb: GET request to render the admin_tools page
router.get('/admin_tools', (req, res) => {
    if (req.user.isAdmin === true) {
        User.find({}).exec(function(err, users) {
                if (err) throw err;
                res.render('users/admin_tools', { "users": users });
            })
            //res.render('users/admin_tools');
    } else {
        req.flash('error', 'Only admins can view this page');
        res.redirect('/profile');
        return;
    }
});

router.delete('/profile', isLoggedIn, catchAsync(async(req, res) => {

    const user = await User.findByIdAndDelete(req.user.id);
    
    req.flash('success', 'You deleted your account');
    res.redirect('/');
}));

module.exports = router;
router.get('/adminProfile', (req, res) => {
    res.render('users/adminProfile');
});
module.exports = router;