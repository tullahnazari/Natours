const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    const message = `${value} ALREADY EXISTS. Please use another value!`
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack

    });

    
}

const sendErrorProd = (err, res) => {

//operational, trusted error: send message to client
if(err.isOperational) {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
//programming or other unknown errorL dont leak error detail 
} else {
    console.error('Error 🥵', err);
    res.status(500).json({
        status: 'error',
        message: 'something went wrong'
    })
}
};

module.exports = (err, req, res, next) => {
    console.log(err.stack)
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'

    if(process.env.NODE_ENV === 'development'){

        sendErrorDev(err, res)
       
    } else if (process.env.NODE_ENV === 'production'){
    let error = {...err};
    if (error.name === 'CastError')  error = handleCastErrorDB(error)
    if (error.code === 11000) error = handleDuplicateFieldsDB(error)
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

        sendErrorProd(error, res);

    }
};

