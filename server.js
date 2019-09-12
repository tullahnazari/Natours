//env variables
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
//Everything not related to express doesn't go in app.js (env var, server connection, etc)
const app = require('./app');


const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`App runnin bruh 🤪 ${port}...`);
});




