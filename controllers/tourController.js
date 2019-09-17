const Tour = require('./../model/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

//middleware to filter for a specific queryparam that has a route
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

//get all documents in collection
exports.getAllTours = async (req, res) => {
  try {
    //execute query
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const tours = await features.query;

    //send query
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        } 
    });
    } catch {
    res.status(404).json({
        status: 'fail',
        message: err
    });
}
};

//get one doc from the collection
exports.getTour = async (req, res) => {

try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
    } catch (err){
    res.status(404).json({
        status: 'fail',
        message: err
    });

}
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

exports.updateTour = async (req, res) => {
try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true, 
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
    } catch (err){
    res.status(404).json({
        status: 'fail',
        message: err
    });

}
}; 

exports.deleteTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);
    
        res.status(204).json({
            status: 'success',
            data: null
        });
        } catch (err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    
    }
    }; 

    exports.getTourStats = async (req, res) => {
        try{
            const stats = await Tour.aggregate([
                {
                    $match: { ratingsAverage: { $gte: 4.5 } }
                },
                { 
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    num: { $sum: 1},
                    numRatings: { $sum: '$ratingsQuantity'},
                    avgRating:{ $avg: '$ratingsAverage'},
                    avgPrice: { $avg: '$price'},
                    minPrice: { $min: '$price'},
                    maxPrice: { $max: '$price'},


                }

                },
                {
                    $sort: { avgPrice: 1 }
                }

            ]);
            res.status(200).json({
                status: 'success',
                data: {
                    stats
                }
            });

        } catch (err){
            res.status(404).json({
                status: 'fail',
                message: err
            });
        }
    }
