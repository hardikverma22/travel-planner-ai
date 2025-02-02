import { v } from "convex/values";
import { query } from "./_generated/server";
import { paginationOptsValidator, PaginationResult } from "convex/server";
import { Doc } from "./_generated/dataModel";

export const paginatedPublishedPlans = query({
  args: {
    companion: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { companion, paginationOpts }) => {
    let paginatedPlanSettings: PaginationResult<Doc<"planSettings">>;
    if (companion) {
      paginatedPlanSettings = await ctx.db
        .query("planSettings")
        .withIndex("by_isPublished_companion_creationTime", (q) =>
          q.eq("isPublished", true).eq("companion", companion)
        )
        .paginate(paginationOpts);
    } else {
      paginatedPlanSettings = await ctx.db
        .query("planSettings")
        .withIndex("by_isPublished", (q) => q.eq("isPublished", true))
        .paginate(paginationOpts);
    }

    const plans = await Promise.all(
      paginatedPlanSettings.page.map(async (setting) => {
        const plan = await ctx.db.get(setting.planId);
        return {
          ...(plan as Doc<"plan">),
          isSharedPlan: false,
          fromDate: setting?.fromDate,
          toDate: setting?.toDate,
        };
      })
    );

    return { ...paginatedPlanSettings, page: plans };
  },
});
