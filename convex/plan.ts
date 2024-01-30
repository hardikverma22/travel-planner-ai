import { action, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

import { v } from "convex/values";
import { generateTravelPlan } from "../lib/openai";

export const getPlanForAUser = query({
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const { subject } = identity;

    const plans = await ctx.db
      .query("plan")
      .filter((q) => q.eq(q.field("userId"), subject))
      .order("desc")
      .take(100);
    // return plans;
    return Promise.all(
      plans.map(async (plan) => ({
        ...plan,
        // If the message is an "image" its `body` is an `Id<"_storage">`
        ...(plan.storageId === null
          ? { url: null }
          : { url: await ctx.storage.getUrl(plan.storageId) }),
      }))
    );
  },
});

export const getSinglePlan = query({
  args: { id: v.id("plan") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const plan = await ctx.db.get(args.id);
    // return plan;
    return { ...plan, url: (plan && plan.storageId) ? await ctx.storage.getUrl(plan.storageId) : null };
  },
});

export const readPlanData = internalQuery({
  args: { id: v.id("plan") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const plan = await ctx.db.get(args.id);
    return plan;
  },
});

export const preparePlan = action({
  args: {
    planId: v.string(),
  },
  handler: async (
    ctx,
    { planId }
  ) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (identity === null) {
        console.log("no identity");
        return null;
      }

      const emptyPlan = await ctx.runQuery(internal.plan.readPlanData, {
        id: planId as Doc<"plan">["_id"]
      });

      if (!emptyPlan) {
        console.error("Unable to find the empty plan while preparing a new one");
        return null;
      };

      const completion = await generateTravelPlan(
        emptyPlan.userPrompt,
      );

      const msg = completion?.choices[0]?.message?.function_call
        ?.arguments as string;

      const model = JSON.parse(msg) as Doc<"plan">;

      ctx.runAction(internal.images.generateAndStore, {
        prompt: model.nameoftheplace,
        planId: emptyPlan._id
      })

      await ctx.runMutation(internal.plan.updatePlanWithAIData, {
        nameoftheplace: model.nameoftheplace,
        abouttheplace: model.abouttheplace,
        thingstodo: model.thingstodo,
        topplacestovisit: model.topplacestovisit,
        besttimetovisit: model.besttimetovisit,
        itinerary: model.itinerary,
        planId: emptyPlan._id,
      });

      await ctx.runMutation(internal.users.reduceUserCreditsByOne);

    } catch (error) {
      throw new Error(`Error occured in prepare Plan Convex action: ${error}`);
    }
  },
});

export const updatePlanWithAIData = internalMutation({
  args: {
    planId: v.id("plan"),
    nameoftheplace: v.string(),
    abouttheplace: v.string(),
    thingstodo: v.array(v.string()),
    topplacestovisit: v.array(v.object({
      name: v.string(),
      coordinates: v.object({
        lat: v.float64(),
        lng: v.float64()
      })
    })),
    itinerary: v.array(v.object({
      title: v.string(),
      activities: v.object({
        morning: v.array(v.string()),
        afternoon: v.array(v.string()),
        evening: v.array(v.string())
      })
    })),
    besttimetovisit: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.planId, {
      nameoftheplace: args.nameoftheplace,
      abouttheplace: args.abouttheplace,
      thingstodo: args.thingstodo,
      topplacestovisit: args.topplacestovisit,
      besttimetovisit: args.besttimetovisit,
      itinerary: args.itinerary
    });
  },
});


export const createEmptyPlan = mutation({
  args: {
    userPrompt: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      console.log("no identity");
      return null;
    }

    const newPlan = await ctx.db.insert("plan", {
      nameoftheplace: "",
      abouttheplace: "",
      thingstodo: [],
      topplacestovisit: [],
      userId: identity.subject,
      userPrompt: args.userPrompt,
      besttimetovisit: "",
      itinerary: [],
      storageId: null
    });
    return newPlan;
  },
});
