const mongoose = require('mongoose');
//const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcryptjs');


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
        required: [true, 'Email is required'],
        lowercase: true,
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    }, 
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        maxlength: [30, 'Password must have less or equal then 30 characters'],
        minlength: [8, 'Please choose a longer password. Minimum 8 characters long.'],
        //password will not show up in any of the responses
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            //this only works on SAVE which is create
            validator: function(el) {
                return el === this.password; ///if passowrd is abc and passowrd COnfirm is abc
            },
            message: "Passwords don't match. Please retry."
        }
    }
});
//turn password to hash values before returning to user
userSchema.pre('save', async function(next) {
    //only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete confirm password
    this.passwordConfirm = undefined;

    next();
});

//instance method. comparing hash and non hash pw to verify user has correct creds when logging in
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

//DB Model from Schema. Model VARS are usually with a capital letter
const User = mongoose.model('User', userSchema);

module.exports = User;