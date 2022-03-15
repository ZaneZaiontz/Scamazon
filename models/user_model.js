const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

//define user schema
const userSchema = new Schema({});

//Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.
userSchema.plugin(passportLocalMongoose);
//Compile module
module.exports = mongoose.model('User', userSchema);
