const fs = require('fs');
const express = require('express');

const app = express();


// app.get('/', (req, res) => {
//     res.status(200).json({message: 'Hello from the server side',
//     app: 'Natours'});
// });

// app.post('/', (req, res) => {
//     res.send('You can post to this endpoint...');
// });

//get tours sim
const tours =JSON.parse(
fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/apis/v1/tour', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    });

});

const port = 8000;
app.listen(port, () => {
    console.log(`App runnin bruh ${port}...`);
}) ;