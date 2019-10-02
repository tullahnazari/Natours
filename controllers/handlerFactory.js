const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new AppError("No result found with that ID", 404))
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
    });

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true, 
        runValidators: true
    });

    if (!doc) {
        return next(new AppError("No tour found with that ID", 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
        });
    });

    exports.createOne = Model => catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);
        res.status(201).json({
            status: 'created',
            data: {
                doc
            }
        });
    });

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {

    //populating reviews in tour routes
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
        return next(new AppError("No Result found with that ID", 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    });
});  

exports.getAll = Model => catchAsync(async (req, res, next) => {
    //to allow for nested GET reviews on tour(it's a hack but reasonable)
    let filter = {}
    if(req.params.tourId) filter = { tour: req.params.tourId };

    //execute query
    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const doc = await features.query;

    //send query
    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            doc
        } 
    });
});
