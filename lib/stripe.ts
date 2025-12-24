import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is missing. Please set it in your .env file.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    typescript: true,
});

export default stripe;
