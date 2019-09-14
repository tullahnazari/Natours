const Tour = require('./../model/tourModel');


exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price'
        })
    }
    next();
};

exports.getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        // results: tours.length,
        // data: {
        //     tours: tours
        // }
    });
};


exports.getTourByID = (req, res) => {
    console.log(req.params);
    //convert id from string to int
    const id = req.params.id * 1;
    //finding the id in the array
    // const tour = tours.find(el => el.id == id);
    // //making sure the id exists in the array
    // if (!tour)
    // {
    //     return res.status(404).json({
    //         status: 'fail',
    //         message: 'Invalid ID'
    //     });
    // }

    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         tour
    //     }
    // });
};  

exports.createTour = (req, res) => {
    res.status(201).json({
        status: 'created',
        // data: {
        //     tour: newTour
        // }
    });

};

exports.updateTour = (req, res) => {

      res.status(200).json({
          status: 'success',
          data: {
              tour: '<Updated tour here...>'
          }
      });
    };

exports.deleteTour = (req, res) => {
      res.status(204).json({
          status: 'success',
          data: {
              tour: null
          }
      });
    };
