//create review model: review: string, Rating, Createdat, ref to tour, ref to user

const mongoose = require('mongoose');
const validator = require('validator');


const reviewSchema = new mongoose.Schema({
    review: {
        type: String, 
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [250, 'A tour name must have liess or equal then 250 characters'],
        minlength: [5, 'A tour name must have more than 5 characters']
    },
    rating: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    createdAt: {
        type: Date, 
        default: Date.now(),
        select: false
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Please log in to review']
        },
    tour:{
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Please select a tour to Review.']
        }
    },
        {
            toJSON: { virtuals: true },
            toObject: { virtuals: true }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;