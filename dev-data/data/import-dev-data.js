//nice lil script for data import from json to db

const fs = require('fs');
const mongoose = require('mongoose');
//env variables
const dotenv = require('dotenv');
const Tour = require('./../../model/tourModel')
dotenv.config({path: './config.env'});


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true, 
    useFindAndModify: false
}).then(() => console.log("DB Connection homie!"));


// READ JSON FIsLE \\
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Tour.create(tours);
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