import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id, Doc } from './_generated/dataModel';

export const addFeedback = mutation({
    args: {
        planId: v.optional(v.id("plan")),
        message: v.string(),
        label: v.union(v.literal('issue'),
            v.literal('idea'),
            v.literal('question'),
            v.literal('complaint'),
            v.literal('featurerequest'),
            v.literal('other'),
        ),
    },
    handler: async (ctx, { message, planId, label }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }
        await ctx.db.insert("feedback", {
            userId: identity.subject as Id<"users">,
            planId,
            message,
            label
        });
    },
});

export const getFeedbacks = query({
    args: {

    },
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const { subject } = identity;
        const feedbacks = await ctx.db
            .query("feedback")
            .order("desc")
            .collect();

        return feedbacks;
    },
});