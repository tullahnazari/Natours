const Tour = require('./../model/tourModel');


//experimenting with making this work, didnt work 
exports.getAllTours = async (req, res) => {
    const newTour = await Tour.getAllTours(req.body);

    res.status(200).json({
        status: 'success',
        data: {
            tour: newTour
        }
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

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'created',
        data: {
            tour: newTour
        }
    });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }

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
