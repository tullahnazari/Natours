const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

//using middleware (middle of request and response)
app.use(express.json());

//Morgan middleware
app.use(morgan('dev'));

//creating our own mw. have to be declared before any apis
app.use((req, res, next) => {
    console.log('Hello from the middleware :)');
    next();
});
//another mw
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

const tours =JSON.parse(
fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//ROUTE HANDLERS
const getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    });
};


const getTourByID = (req, res) => {
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
};  

const createTour = (req, res) => {
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
};

const updateTour = (req, res) => {

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
    };

const deleteTour = (req, res) => {

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
    };
    

//////THIS WAY IS GOOD\\\\\\\\\\\\\\
// //GETALL
// app.get('/apis/v1/tours', getAllTours);
// //GET by ID
// app.get('/apis/v1/tours/:id', getTourByID);
// //posting on all tours
// app.post('/api/v1/tours', createTour);
// //patch request
// app.patch('/api/v1/tours/:id', updateTour);
// //delete req
// app.delete('/api/v1/tours/:id', deleteTour);

//////BUT THIS IS BETTER, DRY and Easier to read\\\\\\\\\\\\\\
//ROUTES
app
.route('/api/v1/tours')
.get(getAllTours)
.post(createTour);

app
.route('/api/v1/tours/:id')
.get(getTourByID)
.patch(updateTour)
.delete(deleteTour);


const port = 8000;
app.listen(port, () => {
    console.log(`App runnin bruh ${port}...`);
});
