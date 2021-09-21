const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./user.model');
// const validator = require('validator');

const toursSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
            maxlength: [40, 'A tour name must not be more than 40 characters'],
            minlength: [10, 'A tour name must not be less than 10 characters'],
            // validate: [
            //     validator.isAlpha,
            //     'Tour name must only contain letters',
            // ],
        },

        slug: String,

        duration: {
            type: Number,
            required: [true, 'A tour must have a duration'],
        },

        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size'],
        },

        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty is either easy, medium or difficult',
            },
        },

        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
            set: (val) => Math.round(val * 10) / 10,
        },

        ratingsQuantity: {
            type: Number,
            default: 0,
        },

        price: {
            type: Number,
            required: [true, 'A tour must have a price'],
        },

        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    // this only points to current doc on NEW document creation
                    return val < this.price;
                },
                message:
                    'Discount price ({VALUE}) should be below the regular price',
            },
        },

        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a summary'],
        },

        description: {
            type: String,
            trim: true,
        },

        imageCover: {
            type: String,
            required: [true, 'A tour must have a cover image'],
        },

        images: [String],

        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },

        startDates: [Date],

        secretTour: {
            type: Boolean,
            default: false,
        },
        startLocation: {
            // GeoJSON
            type: {
                type: String,
                default: 'Point',
                enum: ['Point'],
            },
            coordinates: [Number],
            address: String,
            description: String,
        },

        locations: [
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point'],
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number,
            },
        ],

        guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],

        // reviews: [
        //     {
        //         type: mongoose.Schema.ObjectId,
        //         ref: 'Review',
        //     },
        // ],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// toursSchema.index({ price: 1 });
toursSchema.index({ price: 1, ratingsAverage: -1 });
toursSchema.index({ slug: 1 });
toursSchema.index({ startLocation: '2dsphere' });

toursSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

// Virtual populate
toursSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id',
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
toursSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// toursSchema.pre('save', async function (next) {
//     const guidesPromises = this.guides.map(
//         async (id) => await User.findById(id)
//     );

//     this.guides = await Promise.all(guidesPromises);

//     next();
// });

// toursSchema.pre('save', function (next) {
//     console.log('Will save document');
//     next();
// });

// toursSchema.post('save', function (doc, next) {
//     console.log(doc);
//     next();
// });

// QUERY MIDDLEWARE
// toursSchema.pre('find', function (next) {
toursSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });

    this.start = Date.now();
    next();
});

toursSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt',
    });

    next();
});

// toursSchema.post(/^find/, function (docs, next) {
//     console.log(`Query took ${Date.now() - this.start} milliseconds`);
//     console.log(docs);
//     next();
// });

// AGGREGATION MIDDLEWARE
// toursSchema.pre('aggregate', function (next) {
//     this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//     console.log(this.pipeline());
//     next();
// });

const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;
