const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//////GLOBAL MIDDLEWARES AND THEIR NAMES\\\\\\\

//Set security HTTP headers mw
app.use(helmet());

//Development logging mw
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    }

//limits the amount of calls from singular IP address in x time (100 requests in 1 hour) mw
const limiter = rateLimit({
    max: 5000,
    windowMs: 60* 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour'
});
app.use('/api', limiter);

//Serving static files mw
app.use(express.static(`${__dirname}/public`));

//Body parser, reading data from body into req.body mw
app.use(express.json({ limit: '10kb' }));

//Data sanitization against NoSQL query injection "email": {"$gt": ""},
app.use(mongoSanitize());

//Data Sanitization against XSS
app.use(xss());

//Test Middleware
app.use((req, res, next) => {
    req.requstTime = new Date().toISOString();
    next();
});


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//should be all the way at the bottom because of order of execution(it handles all)
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);


module.exports = app;