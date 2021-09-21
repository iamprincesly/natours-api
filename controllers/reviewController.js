const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review.model');
const {
    deleteOne,
    updateOne,
    createOne,
    getOne,
    getAll,
} = require('./handlerFactory');
// const res = require('express/lib/response');

exports.getAllReviews = getAll(Review);

exports.setTourUserIds = (req, res, next) => {
    // Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;

    next(); 
};

exports.getReview = getOne(Review);

exports.createReview = createOne(Review);

exports.updateReview = updateOne(Review);

exports.deleteReview = deleteOne(Review);
