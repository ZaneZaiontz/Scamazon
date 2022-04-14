/* Tools Requirements */
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user_model');
const Product = require('./models/product_model');

/* Routes requirements */
const productRoutes = require('./routes/product_route');
const userRoutes = require('./routes/user_route');
// 4/8 - added cart route
const cartRoutes = require('./routes/cart_route');
// 4/12 - addded admin route
const adminRoutes = require('./routes/admin_route');
/* Error Handler requirements */
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');

/* Connect to mongDB */
/* 3/29 - changed DB name to ScamazonDB */
mongoose.connect('mongodb://localhost:27017/scamazonDB', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;
//Check if connection is successful
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
	console.log('Database Connected');
});

const app = express();

//set engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
const sessionConfig = {
	secret: 'thisshouldbeabettersecret!',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//define middleware for global use
app.use((req, res, next) => {
	/* 3/30 - added currentUser for global use */
	res.locals.currentUser = req.user;
	/* 4/3 - added session for global use */
	res.locals.session = req.session;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

//define route handlers
app.use('/', userRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/admin', adminRoutes);
/* #### BEGIN ROUTE DEFINITIONS #### */
//home page route
app.get('/', catchAsync(async (req, res) => {
	//res.render('index_test');
	const products = await Product.find({});
	res.render('home', {products});
}));
/* #### END ROUTE DEFINITIONS #### */

/* Begin Error Handlers */
app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Oh No, Something Went Wrong!';
	res.status(statusCode).render('error', { err });
});
/* End Error Handlers */

//port the app is listening on
app.listen(3000, () => {
	console.log('APP IS LISTENING ON PORT 3000!');
});
