import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
// import stripe from "../config/stripe";
import Stripe from 'stripe';
import { v } from "convex/values";

if (!process.env.STRIPE_TEST_SECRET_KEY) {
    throw new Error('STRIPE_TEST_SECRET_KEY is missing. Please set the environment variable.');
}

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY, {
    apiVersion: "2023-10-16",
});


export const pay = action({
    // The action takes the message the user composed
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }
        // We need to tell Stripe where to redirect to
        const domain = process.env.HOSTING_URL ?? "http://localhost:3000";
        // Here we create a document in the "payments" table
        const paymentId = await ctx.runMutation(internal.payments.createEmptyPaymentRecord);
        if (!paymentId)
            return null;
        // This is where the Stripe checkout is configured
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'INR',
                        product_data: {
                            name: "Credits",
                        },
                        unit_amount: 1600,
                    },
                    quantity: 5,

                },
            ],
            mode: "payment",
            customer_email: identity.email,
            // This is how our web page will know which message we paid for
            success_url: `${domain}/dashboard`,
            cancel_url: `${domain}`,
            client_reference_id: identity.subject
        });

        // Keep track of the checkout session ID for fulfillment
        await ctx.runMutation(internal.payments.markPending, {
            paymentId,
            stripeId: session.id,
        });
        // Let the client know the Stripe URL to redirect to
        return session.url;
    },
});

export const fulfill = internalAction({
    args: { signature: v.string(), payload: v.string() },
    handler: async (ctx, { signature, payload }) => {
        const webhookSecret = process.env.WEBHOOK_SIGNING_SECRET as string;
        try {
            // This call verifies the request
            const event = await stripe.webhooks.constructEventAsync(
                payload,
                signature,
                webhookSecret
            );
            if (event.type === "checkout.session.completed") {
                const id = (event.data.object as { id: string }).id;

                const status = (event.data.object as { payment_status: string }).payment_status;
                console.log({ status: status });
                if (status === "paid")
                    await ctx.runMutation(internal.payments.fulfill, { stripeId: id, status });
            }
            return { success: true };
        } catch (err) {
            console.error(err);
            return { success: false };
        }
    },
});