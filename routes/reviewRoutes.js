const express = require('express');
const { restrictTo, protect } = require('../controllers/authController');
const {
    getAllReviews,
    createReview,
    deleteReview,
    updateReview,
    setTourUserIds,
    getReview,
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

// Auth middleware protect (Protect the below routes)
router.use(protect);

router
    .route('/')
    .get(getAllReviews)
    .post(restrictTo('user'), setTourUserIds, createReview);

router
    .route('/:id')
    .get(getReview)
    .patch(restrictTo('user', 'admin'), updateReview)
    .delete(restrictTo('user', 'admin'), deleteReview);

module.exports = router;
