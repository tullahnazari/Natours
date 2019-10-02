const Review = require('./../model/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./../controllers/handlerFactory');

exports.getAllReviews = catchAsync(async(req, res, next) => {
    //filter is to accomadate the tour to make sure it shows reviews for specific tour
    let filter = {}
    if(req.params.tourId) filter = { tour: req.params.tourId };

    const reviews = await Review.find(filter);

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    });

});

exports.createReview = catchAsync(async (req, res, next) => {
    // Allow nested routes
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;

    const newReview = await Review.create(req.body);
    res.status(201).json({
        status: 'created',
        data: {
            review: newReview
        }
    });
});


exports.deleteReview = factory.deleteOne(Review);