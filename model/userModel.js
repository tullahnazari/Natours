const mongoose = require('mongoose');
const crypto = require('crypto');
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
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
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
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});
// //turn password to hash values before returning to user
// userSchema.pre('save', async function(next) {
//     //only run this function if password was actually modified
//     if (!this.isModified('password')) return next();

//     // Hash the password with cost of 12
//     this.password = await bcrypt.hash(this.password, 12);

//     // Delete confirm password
//     this.passwordConfirm = undefined;

//     next();
// });
//any endpoint that finds, which is every one 
userSchema.pre(/^find/, function(next) {
    //this points to the current query, everything that doesnt have an active false 
    this.find({active: {$ne: false}});
    next();

});

userSchema.pre('save', function(next) {
    //if no one changed the password do this
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

//instance method. comparing hash and non hash pw to verify user has correct creds when logging in
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimeStamp;

    }
    
    return false;
};

//generating random pw token
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    console.log({resetToken}, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

//DB Model from Schema. Model VARS are usually with a capital letter
const User = mongoose.model('User', userSchema);

module.exports = User;