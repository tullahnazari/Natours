const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

//merge param to post/get data from endpoints such as 
//POST /tour/123/reviews/3233
//GET /tour/234/reviews/323
const router = express.Router( { mergeParams: true });




router
.route('/')
.get(reviewController.getAllReviews)
.post(authController.protect, authController.restrictTo('user'),
reviewController.setTourUserIds, reviewController.createReview);

router
.route('/:id')
.delete(reviewController.deleteReview)
.patch(reviewController.updateReview);



module.exports = router;