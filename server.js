const mongoose = require('mongoose');
//env variables
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
//Everything not related to express doesn't go in app.js (env var, server connection, etc)
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true, 
    useFindAndModify: false
}).then(() => console.log("DB Connection homie!"));


const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`App runnin bruh 🤪 ${port}...`);
});




