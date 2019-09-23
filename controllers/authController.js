const jwt = require('jsonwebtoken');
const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = catchAsync(async (req, res, next) => {
    //
    const newUser = await User.create({
        //create a user without a role(to prevent allusers from
        //being create as admins)
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    
    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = catchAsync(async(req, res, next) => {
    const {email, password} = req.body;

    //1 check if email and pw exist
     if (!email || !password) {
         next(new AppError('Please provide email and password!', 400));
     }
    //2 check if user exists
    const user = await User.findOne({ email }).select('+password');
     //if user exists and pw is correct
    if (!user || !await user.correctPassword(password, user.password)) {
        return next(new AppError('Incorrect email or password', 401))
    }

    //3 If everything is ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });
});

//middleware function to verify auth users can only access routes
exports.protect = catchAsync(async(req, res, next) => {
    //1. Getting token and check if it exists
    let token;

    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    console.log(token);

    if (!token) {
        return next
        (new AppError('You are not logged in, please log in to continue', 401));
    }

    //2. Verify token

    //3. Check if user still exists

    //4. Check if user changed password after the JWT was issued

    next();

});


