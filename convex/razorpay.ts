"use node"

import { v } from "convex/values";
import { internalAction, internalMutation } from "./_generated/server";
import { ensureEnvironmentVariable } from "./http";
import { internal } from "./_generated/api";
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils')

export type EntityContain =
    | "payment"
    | "order"
    | "refund"
    | "dispute"
    | "invoice"
    | "subscription"
    | "settlement"
    | "virtual_account";

type RazorpayWebhookEventType =
    | 'payment.authorized'
    | 'payment.captured'
    | 'payment.failed'
    | 'payment.refunded'
    | 'order.created'
    | 'order.paid'
    | 'order.failed'
    | 'settlement.created'
    | 'settlement.completed'
    | 'dispute.created'
    | 'dispute.updated'
    | 'dispute.closed'
    | 'workflow_step.created'
    | 'workflow_step.updated'
    | 'workflow_step.completed';

type Event = {
    "entity": string,
    "account_id": string,
    "event": RazorpayWebhookEventType,
    "contains": EntityContain[],
    "payload": {
        "payment": {
            "entity": {
                "id": string,
                "entity": string,
                "amount": number, //need to divide by 100
                "currency": "INR",
                "status": "authorized" | "captured" | "failed",
                "order_id": number,
                "method": string,
                "email": string,
                "contact": string,
                "notes": {
                    "email": string,
                    "phone": string
                },
                "created_at": number //need to multiply by 1000 for unix epoch
            }
        }
    },
    "created_at": number
}


export const validateRazorPayRequest = async (signature: string, body: string) => {
    const razorPayWebhookSecret = ensureEnvironmentVariable("RAZORPAY_WEBHOOK_SECREET");

    const isValid = await validateWebhookSignature(
        body,
        signature,
        razorPayWebhookSecret
    );
    return isValid;
}


export const handleRazorPayWebhook = internalAction({
    args: { signature: v.string(), body: v.string() },
    handler: async (ctx, { signature, body }) => {
        try {
            const isValid = await validateRazorPayRequest(signature, body);

            if (!isValid) {
                return { success: false };
            }

            const requestBody = JSON.parse(body) as unknown as Event;
            const { event, payload } = requestBody;
            const { id, notes, amount, created_at, method, status, currency } = payload.payment.entity;

            switch (event) {
                case "payment.authorized":
                    await ctx.runMutation(internal.payments.authoRizedRazorPay, {
                        paymentId: id,
                        email: notes.email,
                        phone: notes.phone,
                        amount,
                        created_at,
                        method,
                        status,
                        currency
                    });
                    break;
                case "payment.captured":
                    await ctx.runMutation(internal.payments.captureRazorPay, {
                        paymentId: id,
                        email: notes.email,
                        phone: notes.phone,
                        amount,
                        created_at,
                        method,
                        status,
                        currency
                    });
                    break;
                case "payment.failed":
                    await ctx.runMutation(internal.payments.captureRazorPay, {
                        paymentId: id,
                        email: notes.email,
                        phone: notes.phone,
                        amount,
                        created_at,
                        method,
                        status,
                        currency
                    });
                    break;
                default:
                    console.log(`Unhandled event: ${event}`);
                    break;
            }

            return { success: true };
        } catch (err) {
            console.error(err);
            return { success: false };
        }
    },
});

