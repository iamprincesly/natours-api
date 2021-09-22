const Tour = require('../models/tour.model');
const User = require('../models/user.model');
const Booking = require('../models/booking.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.alerts = (req, res, next) => {
    const { alert } = req.query;
    if (alert === 'booking')
        res.locals.alert =
            "You payment was successful, Please check your email for confimation. If your booking does't show up here immediately, please check again after sometimes.";

    next();
};

exports.getOverview = catchAsync(async (req, res) => {
    // 1) Get tour data from collection
    const tours = await Tour.find();

    // 2) Build template

    // 3) Render that template using tour from step 1
    res.status(200)
        .set(
            'Content-Security-Policy',
            `default-src 'self' ${req.protocol}://${req.get(
                'host'
            )} https://*.mapbox.com https://*.stripe.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://js.stripe.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;`
        )
        .render('overview', {
            tours,
        });
});

exports.getTour = catchAsync(async (req, res, next) => {
    // 1) Get the data, for the requested tour (including reviews and guides)
    const { slug } = req.params;
    const tour = await Tour.findOne({ slug: slug }).populate({
        path: 'reviews',
        fields: 'review rating user',
    });

    if (!tour) {
        return next(new AppError('There is no tour with that name.', 404));
    }

    // 2) Build template
    // 3) Render template using the data from step 1

    res.status(200)
        .set(
            'Content-Security-Policy',
            `default-src 'self' ${req.protocol}://${req.get(
                'host'
            )} https://*.mapbox.com https://*.stripe.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://js.stripe.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;`
        )
        .render('tour', {
            title: `${tour.name} Tour`,
            tour,
        });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
    res.status(200)
        .set(
            'Content-Security-Policy',
            `default-src 'self' ${req.protocol}://${req.get(
                'host'
            )} https://*.mapbox.com https://*.stripe.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://js.stripe.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;`
        )
        .render('login', {
            title: 'Login to your account',
        });
});

exports.getAccount = (req, res) => {
    res.status(200)
        .set(
            'Content-Security-Policy',
            `default-src 'self' ${req.protocol}://${req.get(
                'host'
            )} https://*.mapbox.com https://*.stripe.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://js.stripe.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;`
        )
        .render('account', {
            title: 'Your account',
        });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
    // 1) Find all bookings
    const bookings = await Booking.find({ user: req.user.id });

    // 2) Find tours with the returned IDs
    const tourIDs = bookings.map((el) => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs } });

    res.status(200).render('overview', { title: 'My tours', tours });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: name,
            email: email,
        },
        {
            new: true,
            runValidator: true,
        }
    );

    res.status(200)
        .set(
            'Content-Security-Policy',
            `default-src 'self' ${req.protocol}://${req.get(
                'host'
            )} https://*.mapbox.com https://*.stripe.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://js.stripe.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;`
        )
        .render('account', {
            title: 'Your account',
            user: updatedUser,
        });
});
