const mongoose = require('mongoose');
//env variables
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
//Everything not related to express doesn't go in app.js (env var, server connection, etc)
const app = require('./app');

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION: 🤬. Shutting down!');
  process.exit(1);
});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true, 
    useFindAndModify: false
}).then(() => console.log("DB Connection homie!"));


const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`App runnin bruh 🤪 ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION: 🤬. Shutting down!');
  server.close(() => {
  process.exit(1);
  })
});





