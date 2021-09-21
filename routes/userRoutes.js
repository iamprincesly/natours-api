const express = require('express');
const {
    signup,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    protect,
    restrictTo,
    logout,
} = require('../controllers/authController');
const {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe,
    getMe,
    uploadUserPhoto,
    resizeUserPhoto,
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

// Auth middleware protect (Protect the below routes)
router.use(protect);

router.patch('/update-password', updatePassword);
router.patch('/update-info', uploadUserPhoto, resizeUserPhoto, updateMe);
router.get('/get-info', getMe, getUser);
router.delete('/delete-me', deleteMe);

// Access middleware protect (Protect the below routes)
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
