import { Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { internalQuery, mutation, query, QueryCtx } from "./_generated/server";
import { getIdentityOrThrow } from "./utils";

export const getPreferredCurrency = query({
  args: {
    planId: v.id("plan"),
  },
  handler: async (ctx, { planId }) => {
    const identity = await getIdentityOrThrow(ctx);
    console.log(
      `getPreferredCurrency called by ${identity.subject} on planId : ${planId}`
    );
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
    const identity = await getIdentityOrThrow(ctx);
    console.log(
      `addPreferredCurrency called by ${identity.subject} on planId : ${planId}`
    );

    const planSettings = await getCurrentPlanSettings(ctx, planId);
    if (planSettings) {
      await ctx.db.patch(planSettings._id, { currencyCode });
      return;
    }

    await ctx.db.insert("planSettings", {
      userId: identity.subject,
      planId: planId,
      currencyCode,
      isPublished: false,
    });
  },
});

export const getCurrentPlanSettings = async (
  ctx: QueryCtx,
  planId: Id<"plan">
) => {
  const planSetting = await ctx.db
    .query("planSettings")
    .withIndex("by_planId", (q) => q.eq("planId", planId as Id<"plan">))
    .order("desc")
    .first();

  return planSetting;
};

export const getPlanSettings = internalQuery({
  args: {
    planId: v.id("plan"),
  },
  handler: async (ctx, { planId }) => {
    console.log(
      `getPlanSettings called by prepare batch internally for planId : ${planId}`
    );
    const planSetting = await getCurrentPlanSettings(ctx, planId);
    return planSetting;
  },
});

export const updateTravelDates = mutation({
  args: {
    planId: v.id("plan"),
    fromDate: v.number(),
    toDate: v.number(),
  },
  handler: async (ctx, { fromDate, toDate, planId }) => {
    const identity = await getIdentityOrThrow(ctx);
    console.log(
      `updateTravelDates called by ${identity.subject} on planId : ${planId}`
    );

    const planSettings = await getCurrentPlanSettings(ctx, planId);
    if (!planSettings) {
      await ctx.db.insert("planSettings", {
        planId,
        userId: identity.subject,
        fromDate,
        toDate,
        isPublished: false,
      });
      return;
    }

    await ctx.db.patch(planSettings._id, {
      fromDate,
      toDate,
    });
  },
});

export const updateCompanionId = mutation({
  args: {
    planId: v.id("plan"),
    companionId: v.string(),
  },
  handler: async (ctx, { companionId, planId }) => {
    const identity = await getIdentityOrThrow(ctx);

    const planSettings = await getCurrentPlanSettings(ctx, planId);
    if (!planSettings) {
      await ctx.db.insert("planSettings", {
        planId,
        userId: identity.subject,
        companion: companionId,
        isPublished: false,
      });
      return;
    }

    await ctx.db.patch(planSettings._id, {
      companion: companionId,
    });
  },
});

export const updateActivityPreferences = mutation({
  args: {
    planId: v.id("plan"),
    activityPreferencesIds: v.array(v.string()),
  },
  handler: async (ctx, { activityPreferencesIds, planId }) => {
    const identity = await getIdentityOrThrow(ctx);
    console.log(
      `updateActivityPreferences called by ${identity.subject} with ${activityPreferencesIds.toString()}`
    );
    const planSettings = await getCurrentPlanSettings(ctx, planId);
    if (!planSettings) {
      await ctx.db.insert("planSettings", {
        planId,
        userId: identity.subject,
        activityPreferences: activityPreferencesIds,
        isPublished: false,
      });
      return;
    }

    await ctx.db.patch(planSettings._id, {
      activityPreferences: activityPreferencesIds,
    });
  },
});

export const updatePlanPrivacy = mutation({
  args: { isPublished: v.boolean(), planId: v.id("plan") },
  handler: async (ctx, { isPublished, planId }) => {
    const identity = await getIdentityOrThrow(ctx);

    const planSettings = await getCurrentPlanSettings(ctx, planId);
    if (!planSettings) {
      await ctx.db.insert("planSettings", {
        planId,
        userId: identity.subject,
        isPublished,
      });

      return;
    }
    await ctx.db.patch(planSettings._id, {
      isPublished,
    });
  },
});
