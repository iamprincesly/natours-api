/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe(
    'pk_test_51JcCAXBApHaANlgHunWbL2N9HjhyKW6G8GwdHJ1nTfX0IZpRkMZAySJ4wAGvxs9vHgckaH8Fj2Fxz3kRvdlmxXBd008EYDxKMR'
);

export const bookTour = async (tourId) => {
    try {
        // 1) Get checkout session from API
        const session = await axios(
            `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
        );
        // 2) Create chekout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }

    console.log(session);
};
