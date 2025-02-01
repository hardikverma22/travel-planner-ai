import { DataModel, Doc } from "./_generated/dataModel";
import { TableAggregate } from "@convex-dev/aggregate";
import { components } from "./_generated/api";
import { query } from "./_generated/server";
import { v } from "convex/values";

export const publishedPlansWithCompanion = new TableAggregate<{
  Namespace: string;
  Key: number;
  DataModel: DataModel;
  TableName: "planSettings";
}>(components.publishedPlansWithCompanion, {
  sortKey: (doc) => doc._creationTime,
  namespace: (doc) =>
    doc.isPublished ? doc.companion ?? "no-companion" : "unpublished",
});

export const allPublishedPlans = new TableAggregate<{
  Namespace: boolean;
  Key: number;
  DataModel: DataModel;
  TableName: "planSettings";
}>(components.allPublishedPlans, {
  sortKey: (doc) => doc._creationTime,
  namespace: (doc) => doc.isPublished ?? false,
});

export const pageOfAllPlans = query({
  args: {
    offset: v.number(),
    numItems: v.number(),
  },
  handler: async (ctx, { offset, numItems }) => {
    const { key: firstPlanCreationTime } = await allPublishedPlans.at(
      ctx,
      offset,
      {
        namespace: true,
      }
    );

    const paginatedPlanSettings = await ctx.db
      .query("planSettings")
      .withIndex("by_isPublished", (q) =>
        q.eq("isPublished", true).gte("_creationTime", firstPlanCreationTime)
      )
      .take(numItems);

    console.log({ paginatedPlanSettings });

    const plans = await Promise.all(
      paginatedPlanSettings.map(async (setting) => {
        const plan = await ctx.db.get(setting.planId);
        return {
          ...(plan as Doc<"plan">),
          isSharedPlan: false,
          fromDate: setting?.fromDate,
          toDate: setting?.toDate,
        };
      })
    );

    return plans;
  },
});

export const pageOfPlansWithCompanion = query({
  args: {
    offset: v.number(),
    numItems: v.number(),
    companionId: v.optional(v.string()),
  },
  handler: async (ctx, { offset, numItems, companionId }) => {
    console.log({ offset, numItems, companionId });
    const { key: firstPlanCreationTime } = await allPublishedPlans.at(
      ctx,
      offset,
      {
        namespace: true,
      }
    );

    const paginatedPlanSettings = await ctx.db
      .query("planSettings")
      .withIndex("by_isPublished_companion_creationTime", (q) =>
        q
          .eq("isPublished", true)
          .eq("companion", companionId)
          .gte("_creationTime", firstPlanCreationTime)
      )
      .take(numItems);

    console.log({ paginatedPlanSettings });

    const plans = await Promise.all(
      paginatedPlanSettings.map(async (setting) => {
        const plan = await ctx.db.get(setting.planId);
        return {
          ...(plan as Doc<"plan">),
          isSharedPlan: false,
          fromDate: setting?.fromDate,
          toDate: setting?.toDate,
        };
      })
    );

    return plans;
  },
});

export const allPublishedPlansCount = query({
  args: {
    companionId: v.optional(v.string()),
  },
  handler: async (ctx, { companionId }) => {
    return await allPublishedPlans.count(ctx, {
      namespace: true,
      bounds: {},
    });
  },
});

export const plansWithCompanionCount = query({
  args: {
    companionId: v.string(),
  },
  handler: async (ctx, { companionId }) => {
    return await publishedPlansWithCompanion.count(ctx, {
      namespace: companionId,
      bounds: {},
    });
  },
});
