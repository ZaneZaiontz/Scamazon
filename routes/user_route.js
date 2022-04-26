/* Requirements */
const express = require('express');
const router = express.Router();
const User = require('../models/user_model');
const Product = require('../models/product_model');
const Order = require('../models/order_model');
const Cart = require('../models/cart_model');
/* 3/29 - added the following requirements */
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

const { isLoggedIn } = require('../middleware');

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
            if (!username.match('^[a-zA-z]{5,15}$')) {
                req.flash('error', 'Invalid Username');
                return res.redirect('/register');
            }
            if (!password.match('^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!#$%&?@]).*$')) {
                req.flash(
                    'error',
                    'Password must contain at least 1 lowercase or 1 uppercase, 1 digit, 1 special character, and be at least 8 characters long'
                );
                return res.redirect('/register');
            }

            const user = new User({ username });
            if (req.body.adminCode === 'sp22ScamazonAdminCode') {
                user.isAdmin = true;
            }
            const registeredUser = await User.register(user, password);
            req.login(registeredUser, (err) => {
                if (err) return next(err);
                req.flash('success', 'Welcome to Scamazon!');
                const redirectUrl = req.session.returnTo || '/profile';
                //delete redirctURL from the session
                delete req.session.returnTo;
                res.redirect(redirectUrl);
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
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/profile';
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

router.get('/profile', isLoggedIn, (req, res) => {
    if (req.user.isAdmin) res.render('users/adminProfile');
    else res.render('users/profile');
});

// Caleb: GET request to render the manage_profile page
router.get(
    '/manage_profile',
    catchAsync(async (req, res) => {
        const user = await User.findById(req.user.id);

        res.render('users/manage_profile', { user });
    })
);
// Caleb: update username
router.put(
    '/manage_profile',
    isLoggedIn,
    catchAsync(async (req, res) => {
        if (!req.body.newusername.match('^[a-zA-z]{5,15}$')) {
            req.flash('error', 'Invalid Username');
            res.redirect('/manage_profile');
            return;
        } else {
            const user = await User.findByIdAndUpdate(req.user._id, { $set: { username: req.body.newusername } });

            req.flash('success', 'Successfully updated user information! Log back in view changes.');
            res.redirect('/');
        }
    })
);

router.put(
    '/change_password',
    isLoggedIn,
    catchAsync(async (req, res) => {
        const user = await User.findById(req.user.id);
        console.log(req.body.new);
        if (!req.body.new.match('^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*d)(?=.*[!#$%&?@]).*$')) {
            req.flash('error', 'Password must contain at least 1 lowercase or 1 uppercase, 1 digit, 1 special character, and be at least 8 characters long');
            res.redirect('/manage_profile');
            return;
        }

        user.changePassword(req.body.old, req.body.new, function (err, user) {
            if (err) {
                req.flash('error', 'Incorrect old password');
                res.redirect('/manage_profile');
            } else {
                req.flash('success', 'Successfully changed your password!');
                res.redirect('/profile');
            }
        });
    })
);

// Caleb: GET request to render the user_products page
// user_products page will display each product they sell
router.get(
    '/user_products',
    catchAsync(async (req, res) => {
        const products = await Product.find({ author: req.user._id });
        res.render('users/user_products', { products });
    })
);

// Caleb: GET request to render the admin_tools page
// admin_tools page is replaced by adminProfile
router.get('/admin_tools', (req, res) => {
    if (req.user.isAdmin === true) {
        User.find({}).exec(function (err, users) {
            if (err) throw err;
            res.render('users/admin_tools', { users: users });
        });
        //res.render('users/admin_tools');
    } else {
        req.flash('error', 'Only admins can view this page');
        res.redirect('/profile');
        return;
    }
});

router.delete(
    '/profile',
    isLoggedIn,
    catchAsync(async (req, res) => {
        const user = await User.findByIdAndDelete(req.user.id);

        req.flash('success', 'You deleted your account');
        res.redirect('/');
    })
);

router.get('/adminProfile', (req, res) => {
    res.render('users/adminProfile');
});
module.exports = router;
