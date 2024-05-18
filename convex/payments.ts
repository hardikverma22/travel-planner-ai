import { ConvexError, v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { updateUserCredits } from "./users";

// export const createEmptyPaymentRecord = internalMutation({
//     handler: async (ctx) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) {
//             return null;
//         }
//         const { subject } = identity;

//         return await ctx.db.insert("payments", { userId: subject, stripeId: "", status: "initiated" });
//     },
// });

// export const markPending = internalMutation({
//     args: {
//         paymentId: v.id("payments"),
//         stripeId: v.string(),
//     },
//     handler: async (ctx, { paymentId, stripeId }) => {
//         await ctx.db.patch(paymentId, { stripeId, status: "processing" });
//     },
// });

// export const fulfill = internalMutation({
//     args: { stripeId: v.string(), status: v.string() },
//     handler: async (ctx, { stripeId, status }) => {
//         const { db, } = ctx;
//         const { _id, userId } = (await db
//             .query("payments")
//             .withIndex("by_stripe_id", (q) => q.eq("stripeId", stripeId))
//             .unique())!;

//         if (!_id) {
//             console.log("error finding the payment id to update the status after fullfilling the payemnt");
//             return null;
//         }

//         await ctx.db.patch(_id, { status });

//         await updateUserCredits(ctx, userId);
//     },
// });

export const authoRizedRazorPay = internalMutation({
    args: {
        paymentId: v.string(),
        email: v.string(),
        phone: v.string(),
        amount: v.number(),
        created_at: v.number(),
        method: v.string(),
        status: v.union(v.literal("authorized"), v.literal("captured"), v.literal("failed")),
        currency: v.string(),
    },
    handler: async (ctx, args) => {
        const record = (await ctx.db
            .query("payments")
            .withIndex("by_paymentId", (q) => q.eq("paymentId", args.paymentId))
            .unique());

        if (!record) {
            await ctx.db.insert("payments", {
                ...args
            })
        }
    },
});

export const captureRazorPay = internalMutation({
    args: {
        paymentId: v.string(),
        email: v.string(),
        phone: v.string(),
        amount: v.number(),
        created_at: v.number(),
        method: v.string(),
        status: v.union(v.literal("authorized"), v.literal("captured"), v.literal("failed")),
        currency: v.string(),
    },
    handler: async (ctx, args) => {
        const record = await ctx.db
            .query("payments")
            .withIndex("by_paymentId", (q) => q.eq("paymentId", args.paymentId))
            .unique();

        if (!record) {
            await ctx.db.insert("payments", {
                ...args
            })

        } else {
            ctx.db.patch(record._id, { status: args.status });
        }

        if (args.status === "captured")
            await updateUserCredits(ctx, args.email, args.amount);
    }
});