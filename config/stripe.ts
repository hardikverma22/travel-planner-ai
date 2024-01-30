import Stripe from 'stripe';

if (!process.env.STRIPE_TEST_SECRET_KEY) {
    throw new Error('STRIPE_TEST_SECRET_KEY is missing. Please set the environment variable.');
}

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY, {
    apiVersion: "2023-10-16",
});

export default stripe;