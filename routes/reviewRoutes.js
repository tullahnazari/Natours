const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

//merge param to post/get data from endpoints such as api/v1/tours/2323/reviews
const router = express.Router( { mergeParams: true });




router
.route('/')
.get(reviewController.getAllReviews)
.post(authController.protect, authController.restrictTo('user'), reviewController.createReview);





module.exports = router;