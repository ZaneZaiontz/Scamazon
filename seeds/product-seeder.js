const mongoose = require('mongoose');
const Product = require('../models/product');

var products = [
	new Product({
		title: 'Nike Cortez Basic',
		image:
			'https://images.unsplash.com/photo-1552010534-e4e817b173c2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80',
		price: 60,
		discount: 0,
		quantity: 100,
		description:
			'Celebrating 45 years on the track and on the street, Nike Cortez refreshes the iconic runner for the next generation. Durable synthetic leather is overlaid at the toe and heel for support and one-of-a-kind style. '
	}),
	new Product({
		title: 'iPhone 7',
		image: 'https://i.ytimg.com/vi/7Jd7P42qaFM/maxresdefault.jpg',
		price: 650,
		discount: 0,
		quantity: 20,
		description: 'New iPhone 7'
	}),
	new Product({
		title: 'iMac',
		image:
			'https://images.unsplash.com/photo-1560131914-2e469a0e8607?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
		price: 1299,
		discount: 0,
		quantity: 100,
		description:
			"iMac — beautiful, intuitive all-in-one desktops with incredible processors, a Retina display, and the world's most advanced desktop operating system."
	}),
	new Product({
		title: 'Sunglasses',
		image:
			'https://images.unsplash.com/photo-1556015048-4d3aa10df74c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1964&q=80',
		price: 45,
		discount: 0,
		quantity: 50,
		description: 'Sunglasses to wear when its sunny when the sun is shining'
	}),
	new Product({
		title: 'Minolta srT101 camera',
		image:
			'https://images.unsplash.com/photo-1559828688-6c8a04fc5311?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1933&q=80',
		price: 220,
		discount: 0,
		quantity: 20,
		description: 'Vintage Minolta srT101 camera with black and white negative film'
	})
];

/* Connect to mongDB */
mongoose.connect('mongodb://localhost:27017/scamazon-demo', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;
//Check if connection is successful
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
	console.log('Database Connected');
});

//delete everything in db and add products
const seedDB = async () => {
	await Product.deleteMany({});
	for (let i = 0; i < products.length; i++) {
		await products[i].save();
	}
};

seedDB();
