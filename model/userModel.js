const mongoose = require('mongoose');
//const slugify = require('slugify');
const validator = require('validator');


//DB Schema should contain 5 fields:
//name, email, photo, password, passwordConfirm
const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Name is required'],
        lowercase: true,
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    }, 
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        maxlength: [30, 'Password must have less or equal then 40 characters'],
        minlength: [8, 'Password must have less or equal then 40 characters']
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'] 
    }
});

//DB Model from Schema. Model VARS are usually with a capital letter
const User = mongoose.model('User', userSchema);

module.exports = User;