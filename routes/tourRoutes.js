const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
// const { createReview } = require('../controllers/reviewController');
const {
    aliasTopTours,
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    getTourStats,
    getMonthlyPlan,
    getToursWithin,
    getDistances,
    resizeTourImages,
    uploadTourImages,
} = require('../controllers/tourController');

const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// router
//     .route('/:tourId/reviews')
//     .post(protect, restrictTo('user'), createReview);
router.use('/:tourId/reviews', reviewRouter);

// router.param('id', checkID);

// Create a checkBody middleware
// Check if body contains the name and price property
// If not, send back 400 (bad request)
// Add it to the post handler stack
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);
router
    .route('/monthly-plan/:year')
    .get(protect, restrictTo('admin', 'lead-guide'), getMonthlyPlan);

router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(getToursWithin);
// /tours-distance?distance=233&center=-40,45&unit=ml
// /tours-distance/233/center/-40,45/unit/ml

router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
    .route('/')
    .get(getAllTours)
    .post(protect, restrictTo('admin', 'lead-guide'), createTour);

router
    .route('/:id')
    .get(getTour)
    .patch(
        protect,
        restrictTo('admin', 'lead-guide'),
        uploadTourImages,
        resizeTourImages,
        updateTour
    )
    .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
