import { ActionCtx, action, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

import { v } from "convex/values";

import {
  generatebatch1,
  generatebatch2,
  generatebatch3
} from "../lib/openai";

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
    return { ...plan!, url: (plan && plan.storageId) ? await ctx.storage.getUrl(plan.storageId) : null };
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

export const IsAuthenticated = async (ctx: ActionCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    console.log("no identity");
    return false;
  }
  return true;
}

const fetchEmptyPlan = async (ctx: ActionCtx, planId: string) => {
  return ctx.runQuery(internal.plan.readPlanData, {
    id: planId as Doc<"plan">["_id"]
  });
}

//Actions to be called for prepareing the plan
export const prepareBatch1 = action({
  args: {
    planId: v.string(),
  },
  handler: async (
    ctx,
    { planId }
  ) => {
    try {

      if (!IsAuthenticated(ctx)) { return null }

      const emptyPlan = await fetchEmptyPlan(ctx, planId);

      if (!emptyPlan) {
        console.error("Unable to find the empty plan while preparing a new one");
        return null;
      };

      const completion = await generatebatch1(
        emptyPlan.userPrompt,
      );

      const nameMsg = completion?.choices[0]?.message?.function_call
        ?.arguments as string;

      const modelName = JSON.parse(nameMsg) as
        Pick<Doc<"plan">, "nameoftheplace" |
          "abouttheplace" |
          "besttimetovisit">;

      await ctx.runMutation(internal.plan.updatePlaceNameAboutThePlaceBestTimeToVisit, {
        nameoftheplace: modelName.nameoftheplace,
        abouttheplace: modelName.abouttheplace,
        besttimetovisit: modelName.besttimetovisit,
        planId: emptyPlan._id,
      });

      await ctx.runAction(internal.images.generateAndStore, {
        prompt: modelName.nameoftheplace,
        planId: emptyPlan._id
      })

      await ctx.runMutation(internal.users.reduceUserCreditsByOne);

    } catch (error) {
      throw new Error(`Error occured in prepare Plan Convex action: ${error}`);
    }
  },
});

export const prepareBatch2 = action({
  args: {
    planId: v.string(),
  },
  handler: async (
    ctx,
    { planId }
  ) => {
    try {

      if (!IsAuthenticated(ctx)) { return null }

      const emptyPlan = await fetchEmptyPlan(ctx, planId);

      if (!emptyPlan) {
        console.error("Unable to find the empty plan while preparing a new one");
        return null;
      };

      const completion = await generatebatch2(
        emptyPlan.userPrompt,
      );

      const nameMsg = completion?.choices[0]?.message?.function_call
        ?.arguments as string;

      const modelName = JSON.parse(nameMsg) as
        Pick<Doc<"plan">, "adventuresactivitiestodo" |
          "localcuisinerecommendations" |
          "packingchecklist">;

      await ctx.runMutation(internal.plan.updateActivitiesToDoPackingChecklistLocalCuisineRecommendations, {
        adventuresactivitiestodo: modelName.adventuresactivitiestodo,
        localcuisinerecommendations: modelName.localcuisinerecommendations,
        packingchecklist: modelName.packingchecklist,
        planId: emptyPlan._id,
      });

    } catch (error) {
      throw new Error(`Error occured in prepare Plan Convex action: ${error}`);
    }
  },
});

export const prepareBatch3 = action({
  args: {
    planId: v.string(),
  },
  handler: async (
    ctx,
    { planId }
  ) => {
    try {

      if (!IsAuthenticated(ctx)) { return null }

      const emptyPlan = await fetchEmptyPlan(ctx, planId);

      if (!emptyPlan) {
        console.error("Unable to find the empty plan while preparing a new one");
        return null;
      };

      const completion = await generatebatch3(
        emptyPlan.userPrompt,
      );

      const nameMsg = completion?.choices[0]?.message?.function_call
        ?.arguments as string;

      const modelName = JSON.parse(nameMsg) as
        Pick<Doc<"plan">, "itinerary" | "topplacestovisit">;

      await ctx.runMutation(internal.plan.updateItineraryTopPlacesToVisit, {
        itinerary: modelName.itinerary,
        topplacestovisit: modelName.topplacestovisit,
        planId: emptyPlan._id,
      });

    } catch (error) {
      throw new Error(`Error occured in prepare Plan Convex action: ${error}`);
    }
  },
});

//Mutation Patches
export const updatePlaceNameAboutThePlaceBestTimeToVisit = internalMutation({
  args: {
    planId: v.id("plan"),
    nameoftheplace: v.string(),
    abouttheplace: v.string(),
    besttimetovisit: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.planId, {
      nameoftheplace: args.nameoftheplace,
      abouttheplace: args.abouttheplace,
      besttimetovisit: args.besttimetovisit,
    });
  },
});

export const updateActivitiesToDoPackingChecklistLocalCuisineRecommendations = internalMutation({
  args: {
    planId: v.id("plan"),
    adventuresactivitiestodo: v.array(v.string()),
    packingchecklist: v.array(v.string()),
    localcuisinerecommendations: v.array(v.string())
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.planId, {
      adventuresactivitiestodo: args.adventuresactivitiestodo,
      packingchecklist: args.packingchecklist,
      localcuisinerecommendations: args.localcuisinerecommendations
    });
  },
});

export const updateItineraryTopPlacesToVisit = internalMutation({
  args: {
    planId: v.id("plan"),
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
        morning: v.array(v.object({
          itineraryItem: v.string(),
          briefDescription: v.string()
        })),
        afternoon: v.array(v.object({
          itineraryItem: v.string(),
          briefDescription: v.string()
        })),
        evening: v.array(v.object({
          itineraryItem: v.string(),
          briefDescription: v.string()
        })),
      })
    })),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.planId, {
      topplacestovisit: args.topplacestovisit,
      itinerary: args.itinerary,
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
      adventuresactivitiestodo: [],
      topplacestovisit: [],
      userId: identity.subject,
      userPrompt: args.userPrompt,
      besttimetovisit: "",
      itinerary: [],
      storageId: null,
      localcuisinerecommendations: [],
      packingchecklist: []
    });
    return newPlan;
  },
});
