import { internalMutation } from "./_generated/server";
import {
  allPublishedPlans,
  publishedPlansWithCompanion,
} from "./plansAggregate";

export const backfillPlanSettingsAggregate = internalMutation({
  handler: async (ctx) => {
    for await (const doc of ctx.db.query("planSettings")) {
      if (doc.isPublished && doc.companion)
        await publishedPlansWithCompanion.insert(ctx, doc);
      if (doc.isPublished) await allPublishedPlans.insert(ctx, doc);
    }
  },
});
