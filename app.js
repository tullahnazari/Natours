const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//serving static files MW
app.use(express.static(`${__dirname}/public`));
//using middleware (middle of request and response)
app.use(express.json());
//Morgan middleware and enviroment added
if (process.env.NODE_ENV === 'development') {
app.use(morgan('dev'));
}

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//should be all the way at the bottom because of order of execution(it handles all)
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);


module.exports = app;