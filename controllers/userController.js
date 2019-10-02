const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./../controllers/handlerFactory');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};


exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    //send query
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});

exports.updateMe = catchAsync( async (req, res, next) => {
    //1. create error if user POSTS pw data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updatepassword route.', 400));
    }

    //2. filtering only fields that should be updated(name and email)
    const filteredBody = filterObj(req.body, 'name', 'email');

    //2. update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {new: true, runValidators: true});

    res.status(200).json({
        status: 'success',
        data: {
             user: updatedUser
        }
    });
});

exports.deleteMe = catchAsync( async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
 
    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getUser = (req, res) => {
    res.status(500).json({ 
        status: 'error',
        message: 'This route is not yet implemented'
    });
};

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented'
    });
};

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
    
