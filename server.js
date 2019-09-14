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

//DB Schema
const tourSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'A tour must have a name'],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    }
});

//DB Model from Schema
const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
    name: 'The Park Bikeddr',
    price: 2323
});

testTour.save().then(doc => {
    console.log(doc);
}).catch(err => {
    console.log('Error 🤪 : ', err);
});


const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`App runnin bruh 🤪 ${port}...`);
});




