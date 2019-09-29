const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// const User = require('./userModel');


//DB Schema
const tourSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [30, 'A tour name must have liess or equal then 40 characters'],
        minlength: [5, 'A tour name must have liess or equal then 40 characters'],
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
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either easy, medium, or difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    retailPrice: {
        type: Number
    },
    priceDiscount: {
        type: Number,
        //custom validator checking if discount price is greater than price
        validate: {
            validator: function(val) {
                //This only works on POST endpoints, have to add additional logic for PUT
                return val < this.retailPrice; //250 < 200
            },
            message: 'Discount price {VALUE} should be below retail price'

        }
    },
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
    },
    //How to create embedded documents (non referencing documents)
    startLocation: {
        //GeoJSON need type and coordinates
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    //Embed guides in to tours

    //Now Referencing(ref: User), it was embedded before this
    guides: [
        {
        type: mongoose.Schema.ObjectId,
        ref: 'User'

        }
    ]
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

tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    });

    next();

})

//embedding guides data into tour model on CREATE ONLY
// tourSchema.pre('save', async function(next) {
//     const guidesPromises = this.guides.map(async id => User.findById(id));
//     this.guides = await Promise.all(guidesPromises);
//     next();
// });

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