const fs = require('fs');
const express = require('express');

const app = express();

//using middleware (middle of request and response)
app.use(express.json());

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
//posting on all tours
app.post('/api/v1/tours', (req, res) => {
    //console.log(req.body);

    const newId = tours[tours.length - 1].id +1;
    const newTour = Object.assign({id: newId}, req.body);

    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, 
    JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'created',
            data: {
                tour: newTour
            }
        });
    
    });

});

const port = 8000;
app.listen(port, () => {
    console.log(`App runnin bruh ${port}...`);
}) ;