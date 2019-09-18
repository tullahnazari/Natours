const mongoose = require('mongoose');
const slugify = require('slugify');


//DB Schema
const tourSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true
    },
    slug: String, 
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number, 
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String, 
        required: [true, 'A tour must have a difficulty']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    description: {
        type: String, 
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'An image needs to be uploaded']
    },
    //storing an array of strings[image references]
    images: [String],
    createdAt: {
        type: Date, 
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
},
 {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7;
});

//doc mw: runs before .save() command and .create but not .insertMany
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// tourSchema.pre('save', function(next) {
//     console.log('Will save document...')
//     next();
// });

// tourSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next();
// });

//QUERY mw(secret tours or vip group of ppl. not everyone should see the results for that in tour db)
tourSchema.pre(/^find/, function(next) {
    this.find({ secretTour: {$ne: true} });
    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function(docs, next) {
    next();
});


//DB Model from Schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;