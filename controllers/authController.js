const crypto = require('crypto');
const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user, statusCode, res) => {

    const token = signToken(user._id);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
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
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    });

    createSendToken(newUser, 201, res);

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
    createSendToken(user, 200, res);
});

//middleware function to verify auth users can only access routes
exports.protect = catchAsync(async(req, res, next) => {
    //1. Getting token and check if it exists
    let token;

    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next
        (new AppError('You are not logged in, please log in to continue', 401));
    }

    //2. Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3. Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('This user does not exist'))
    }

    //4. Check if user changed password after the JWT was issued. instance method in schema
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError('User recently changed password! Please log in again.', 401)
        );
    }

    //GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();

});

//authorization: get role to determine if that role can do the action
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        //roles is an array, role='user'
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have perms for this', 403))
        };

        next();
        
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
//1. get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
    return next(new AppError('There is no user with that email address.', 404));
    }

//2. generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

//3. Send it to user's email
const resetURL = `${req.protocol}://${req.get(
    'host'
    )}/api/v1/users/resetpassword/${resetToken}`;


const message = `Forgot your password? Submit a reset request with your new password 
and passwordConfirm to: ${resetURL}.\n If you didn't make this request, please ignore this email.`;
try {
    await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message
        });

    res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
        });
    } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Please try again'), 500)
}

});

exports.resetPassword = catchAsync(async (req, res, next) => {
//1. GET user based on the token
const hashedToken = crypto
.createHash('sha256')
.update(req.params.token)
.digest('hex');

const user = await User.findOne({
    passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}
});

//2. If token has not expired, and there is user, set the new password
if (!user) {
    return next(new AppError('Token is invalid or has expired', 400))
}
user.password = req.body.password;
user.passwordConfirm = req.body.passwordConfirm;
user.passwordResetToken = undefined;
user.passwordResetExpires = undefined;
await user.save();

//3. Update changedPasswordAt property for the user
//4. Log the user in, send JWT
createSendToken(user, 200, res);

});

exports.updatePassword = catchAsync( async (req, res, next) => {
    //Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    //2. check if POSTED current pw is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong,', 401));

    }
    //3. if correct, update pw
    //User.findByIDandUpdate will not work as intended, that's why we doing it like below
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    
    //4. Log user in, send JWT
    createSendToken(user, 200, res);
})
