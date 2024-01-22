import { action, internalMutation, mutation, query } from "./_generated/server";
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
    return plans;
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
    return plan;
  },
});

export const preparePlan = action({
  args: {
    promptText: v.string(),
    budget: v.number(),
    season: v.string(),
  },
  handler: async (
    ctx,
    { promptText, budget, season }
  ): Promise<string | null> => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (identity === null) {
        console.log("no identity");
        return null;
      }

      console.log({ subject: identity.subject });

      const completion = await generateTravelPlan(
        promptText,
        budget,
        season
      );

      const msg = completion?.choices[0]?.message?.function_call
        ?.arguments as string;

      const model = JSON.parse(msg) as Doc<"plan">;

      const newPlanId = await ctx.runMutation(internal.plan.createPlan, {
        nameoftheplace: model.nameoftheplace,
        abouttheplace: model.abouttheplace,
        thingstodo: model.thingstodo,
        userId: identity.subject,
        topplacestovisit: model.topplacestovisit,
        userPrompt: promptText,
        besttimetovisit: model.besttimetovisit,
        itinerary: model.itinerary
      });

      return newPlanId || null;
    } catch (error) {
      throw new Error(`Error occured in prepare Plan Convex action: ${error}`);
    }
  },
});

export const createPlan = internalMutation({
  args: {
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
    userId: v.string(),
    userPrompt: v.string(),
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
    const newPlan = await ctx.db.insert("plan", {
      nameoftheplace: args.nameoftheplace,
      abouttheplace: args.abouttheplace,
      thingstodo: args.thingstodo,
      topplacestovisit: args.topplacestovisit,
      userId: args.userId,
      userPrompt: args.userPrompt,
      besttimetovisit: args.besttimetovisit,
      itinerary: args.itinerary
    });
    return newPlan;
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
      itinerary: []
    });
    return newPlan;
  },
});
