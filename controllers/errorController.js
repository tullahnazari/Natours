
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

        sendErrorProd(err, res);

    }
};

