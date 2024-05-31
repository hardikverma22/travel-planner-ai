import { Id } from './_generated/dataModel';
import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";

export const getPreferredCurrency = query({
    args: {
        planId: v.id("plan"),
    },
    handler: async (ctx, { planId }) => {
        const planSetting = await getCurrentPlanSettings(ctx, planId);
        return planSetting?.currencyCode;
    },
});

export const addPreferredCurrency = mutation({
    args: {
        planId: v.id("plan"),
        currencyCode: v.string(),
    },
    handler: async (ctx, { planId, currencyCode }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            console.log("Not logged in to delete a user");
            return null;
        }

        const planSettings = await getCurrentPlanSettings(ctx, planId);
        if (planSettings) {
            await ctx.db.patch(planSettings._id, { currencyCode });
            return;
        }

        await ctx.db.insert("planSettings", {
            userId: identity.subject,
            planId: planId,
            currencyCode
        })
    },
});

const getCurrentPlanSettings = async (ctx: QueryCtx, planId: Id<"plan">) => {
    const planSetting = await ctx.db
        .query("planSettings")
        .withIndex("by_planId", (q) => q.eq("planId", planId as Id<"plan">))
        .order("desc")
        .first()

    return planSetting;
}
