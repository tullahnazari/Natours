//nice lil script for data import from json to db

const fs = require('fs');
const mongoose = require('mongoose');
//env variables
const dotenv = require('dotenv');
const Tour = require('./../../model/tourModel');
const Review = require('./../../model/reviewModel');
const User = require('./../../model/userModel');
dotenv.config({path: './config.env'});


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true, 
    useFindAndModify: false
}).then(() => console.log("DB Connection homie!"));


// READ JSON FIsLE \\
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
//
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Tour.create(tours);
        //turns validation off for the model  { validateBeforeSave: false }
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews,  { validateBeforeSave: false });
        console.log('Data Successfully LOADED!!!')
        process.exit();
    } catch(err) {
        console.log(err);
    }
};

//DELETE ALL DATA FROM DB COLLECTION
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data all deleted');
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

if(process.argv[2] === '--import') {
    importData()
}else if (process.argv[2] === '--delete') {
    deleteData();
}

console.log(process.argv);