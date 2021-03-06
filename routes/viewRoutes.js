const express = require('express');
const { protect, checkAuth } = require('../controllers/authController');
const {
    getOverview,
    getTour,
    getLoginForm,
    getAccount,
    updateUserData,
    getMyTours,
    alerts,
} = require('../controllers/viewController');

const router = express.Router();

router.use(alerts);

router.get('/me', protect, getAccount);
router.get('/my-tours', protect, getMyTours);
router.post('/submit-user-data', protect, updateUserData);

router.use(checkAuth);
router.get('/', getOverview);
router.get('/tour/:slug', getTour);
router.get('/login', getLoginForm);

module.exports = router;
