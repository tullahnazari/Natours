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

app.get('/apis/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    });

});
    
//GET by ID
app.get('/apis/v1/tours/:id', (req, res) => {
    console.log(req.params);
    //convert id from string to int
    const id = req.params.id * 1;
    //finding the id in the array
    const tour = tours.find(el => el.id == id);
    //making sure the id exists in the array
    if (!tour)
    {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
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

//patch request
app.patch('/api/v1/tours/:id', (req, res) => {

  if (req.params.id * 1 > tours.length)
    {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    });

});

app.delete('/api/v1/tours/:id', (req, res) => {

    if (req.params.id * 1 > tours.length)
      {
          return res.status(404).json({
              status: 'fail',
              message: 'Invalid ID'
          });
      }
      res.status(204).json({
          status: 'success',
          data: {
              tour: null
          }
      });
  
  });

const port = 8000;
app.listen(port, () => {
    console.log(`App runnin bruh ${port}...`);
});
