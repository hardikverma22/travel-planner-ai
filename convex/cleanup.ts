import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const fixImages = mutation({
  args: { date: v.number() },
  handler: async (ctx, args) => {
    const plans = await ctx.db
      .query("plan")
      .filter((q) => q.gte(q.field("_creationTime"), args.date))
      .collect();

    plans?.forEach(async (plan) => {
      const name = plan.nameoftheplace.split(",");
      if (name && name.length > 1) {
        await ctx.scheduler.runAfter(0, api.images.generateAndStore, {
          prompt: name[0],
          planId: plan._id,
        });
      }
    });
  },
});
export const fixImageForAPlan = mutation({
  args: { planId: v.string(), placeName: v.string() },
  handler: async (ctx, { placeName, planId }) => {
    await ctx.scheduler.runAfter(0, api.images.generateAndStore, {
      prompt: placeName,
      planId: planId as Id<"plan">,
    });
  },
});

export const updateImageUrlInPlan = mutation({
  args: {},
  handler: async (ctx, args) => {
    const plans = await ctx.db.query("plan").collect();

    plans?.forEach(async (plan) => {
      if (plan.storageId && !plan.imageUrl) {
        const url = await ctx.storage.getUrl(plan.storageId);
        if (url) {
          await ctx.db.patch(plan._id, {
            imageUrl: url,
          });
        }
      }
    });
  },
});

export const deleteOrphanImnages = mutation({
  async handler(ctx, args) {
    const planStorageIds = (await ctx.db.query("plan").collect()).map(
      (p) => p.storageId
    );
    const storageIds = (await ctx.db.system.query("_storage").collect()).map(
      (a) => a._id
    );
    console.log(planStorageIds);
    console.log(storageIds);

    storageIds.forEach(async (id) => {
      if (!planStorageIds.includes(id)) return await ctx.storage.delete(id);
    });
  },
});

export const fillDefaultValues = mutation({
  async handler(ctx, args) {
    const planIds = (await ctx.db.query("plan").collect()).map((p) => p._id);
    planIds?.forEach(async (planId) => {
      await ctx.db.patch(planId, {
        contentGenerationState: {
          imagination: true,
          abouttheplace: true,
          adventuresactivitiestodo: true,
          topplacestovisit: true,
          itinerary: true,
          localcuisinerecommendations: true,
          packingchecklist: true,
          besttimetovisit: true,
        },
      });
    });
  },
});

export const fixPlanGenerations = mutation({
  args: { planIds: v.array(v.id("plan")), shouldFixImages: v.boolean() },
  handler: async (ctx, args) => {
    args.planIds?.forEach(async (planId) => {
      await ctx.scheduler.runAfter(0, api.plan.prepareBatch1, {
        planId,
      });
      await ctx.scheduler.runAfter(0, api.plan.prepareBatch2, {
        planId,
      });
      await ctx.scheduler.runAfter(0, api.plan.prepareBatch3, {
        planId,
      });
    });

    if (args.shouldFixImages) {
      args.planIds?.forEach(async (planId) => {
        const plan = await ctx.db.get(planId);
        if (plan && plan.nameoftheplace.length > 0) {
          const name = plan.nameoftheplace.split(",");
          if (name && name.length > 1) {
            await ctx.scheduler.runAfter(0, api.images.generateAndStore, {
              prompt: name[0],
              planId: plan._id,
            });
          }
        }
      });
    }
  },
});

export const denormalizeImageUrl = mutation({
  async handler(ctx, args) {
    const plans = await ctx.db.query("plan").collect();

    // Use Promise.all with map instead of forEach
    await Promise.all(
      plans.map(async (plan) => {
        try {
          if (!plan.imageUrl) {
            const imageUrl = plan.storageId
              ? await ctx.storage.getUrl(plan.storageId)
              : null;

            if (imageUrl) {
              console.log("inside");
              await ctx.db.patch(plan._id, { imageUrl });
            }
          }
        } catch (error) {
          console.error(`Failed to process plan ${plan._id}:`, error);
          // You might want to handle the error differently depending on your needs
        }
      })
    );
  },
});
