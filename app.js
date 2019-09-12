const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//using middleware (middle of request and response)
app.use(express.json());
//Morgan middleware and enviroment added
if (process.env.NODE_ENV === 'development') {
app.use(morgan('dev'));
}

//serving static files MW
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;