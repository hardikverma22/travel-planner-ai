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


export const deleteOrphanImnages = mutation({
    async handler(ctx, args) {
        const planStorageIds = (await ctx.db.query("plan").collect()).map(p => p.storageId);
        const storageIds = (await ctx.db.system.query("_storage").collect()).map(a => a._id);
        console.log(planStorageIds);
        console.log(storageIds);

        storageIds.forEach(async id => {
            if (!planStorageIds.includes(id))
                return await ctx.storage.delete(id);
        })
    },
})

export const fillDefaultValues = mutation({
    async handler(ctx, args) {
        const planIds = (await ctx.db.query("plan").collect()).map(p => p._id);
        planIds?.forEach(async planId => {
            await ctx.db.patch(planId, {
                contentGenerationState: {
                    imagination: true,
                    abouttheplace: true,
                    adventuresactivitiestodo: true,
                    topplacestovisit: true,
                    itinerary: true,
                    localcuisinerecommendations: true,
                    packingchecklist: true,
                    besttimetovisit: true
                }
            })
        });
    },
})