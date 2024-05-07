import { api } from "./_generated/api";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const fixImages = mutation({
    args: { date: v.number() },
    handler: async (ctx, args) => {

        const plans = await ctx.db.query("plan")
            .filter(q => q.gte(q.field("_creationTime"), args.date))
            .collect();

        plans?.forEach(async plan => {
            const name = plan.nameoftheplace.split(",")
            if (name && name.length > 1) {
                await ctx.scheduler.runAfter(0, api.images.generateAndStore, {
                    prompt: name[0],
                    planId: plan._id
                });
            }
        });
    },
});