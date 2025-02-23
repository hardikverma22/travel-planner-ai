import { Doc, Id } from "./_generated/dataModel";
import { ConvexError, v } from "convex/values";
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

    const plan = await ctx.db.get(planId);
    if (!plan)
      throw new ConvexError(
        "Unable to published the Plan as we could not find it."
      );
    if (isPublished) {
      // Type-safe validation
      const requiredFields: {
        name: keyof Doc<"plan">;
        displayName: string;
        isValid: (val: any) => boolean;
      }[] = [
        {
          name: "abouttheplace",
          displayName: "About the Place",
          isValid: (val: typeof plan.abouttheplace) =>
            typeof val === "string" && val.trim().length > 0,
        },
        {
          name: "adventuresactivitiestodo",
          displayName: "Top activities to look for",
          isValid: (val: typeof plan.adventuresactivitiestodo) =>
            Array.isArray(val) && val.length > 0,
        },
        {
          name: "topplacestovisit",
          displayName: "Top places to visit",
          isValid: (val: typeof plan.topplacestovisit) =>
            Array.isArray(val) && val.length > 0,
        },
        {
          name: "packingchecklist",
          displayName: "Packing Checklist",
          isValid: (val: typeof plan.packingchecklist) =>
            Array.isArray(val) && val.length > 0,
        },
        {
          name: "localcuisinerecommendations",
          displayName: "Local Cuisine Recommendations",
          isValid: (val: typeof plan.localcuisinerecommendations) =>
            Array.isArray(val) && val.length > 0,
        },
        {
          name: "besttimetovisit",
          displayName: "Best Time To Visit",
          isValid: (val: typeof plan.besttimetovisit) =>
            typeof val === "string" && val.trim().length > 0,
        },
        {
          name: "itinerary",
          displayName: "Itinerary",
          isValid: (val: typeof plan.itinerary) =>
            Array.isArray(val) &&
            val.length > 0 &&
            val.every(
              (day) =>
                typeof day.title === "string" &&
                day.title.trim().length > 0 &&
                Array.isArray(day.activities.morning) &&
                day.activities.morning.length > 0 &&
                Array.isArray(day.activities.afternoon) &&
                day.activities.afternoon.length > 0 &&
                Array.isArray(day.activities.evening) &&
                day.activities.evening.length > 0
            ),
        },
      ];

      const missingFields = requiredFields
        .filter(({ name, isValid }) => !isValid(plan[name]))
        .map((f) => f.displayName);

      if (missingFields.length > 0) {
        throw new ConvexError(
          `Missing required fields: ${missingFields.join(", ")}.\n` +
            `Please complete all sections before publishing.`
        );
      }
    }

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
