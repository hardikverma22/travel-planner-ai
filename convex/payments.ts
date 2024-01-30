import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { updateUserCredits } from "./users";

export const createEmptyPaymentRecord = internalMutation({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }
        const { subject } = identity;

        return await ctx.db.insert("payments", { userId: subject, stripeId: "", status: "initiated" });
    },
});

export const markPending = internalMutation({
    args: {
        paymentId: v.id("payments"),
        stripeId: v.string(),
    },
    handler: async (ctx, { paymentId, stripeId }) => {
        await ctx.db.patch(paymentId, { stripeId, status: "processing" });
    },
});

export const fulfill = internalMutation({
    args: { stripeId: v.string(), status: v.string() },
    handler: async (ctx, { stripeId, status }) => {
        const { db, } = ctx;
        const { _id, userId } = (await db
            .query("payments")
            .withIndex("by_stripe_id", (q) => q.eq("stripeId", stripeId))
            .unique())!;

        if (!_id) {
            console.log("error finding the payment id to update the status after fullfilling the payemnt");
            return null;
        }

        await ctx.db.patch(_id, { status });

        await updateUserCredits(ctx, userId);
    },
});