const Tour = require('./../model/tourModel');

//get all documents in collection
exports.getAllTours = async (req, res) => {
  try {
    //build query
    //1A: basic filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    
    //query param with 'req.query'
    //1B: advanced filtering greater than less than
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    let query = Tour.find(JSON.parse(queryStr));
    
    //2: Sorting
    if (req.query.sort) {
        const sortBy =req.query.sort.split(',').join('');
        query = query.sort(req.query.sort);
    } else {
        query = query.sort('-createdAt')
    }

    

    //4: Pagination 
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    //page=2&limit=10
    query = query.skip(skip).limit(limit);
    //error handling if no more results exists on different pages
    if (req.query.page) {
        const numTours = await Tour.countDocuments();
        if (skip >= numTours) throw new Error('This page does not exist');
    }
    //execute query
    const tours = await query;

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
