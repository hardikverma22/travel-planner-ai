import { ActionCtx, MutationCtx, QueryCtx, action, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";

import { ConvexError, v } from "convex/values";

import {
  generatebatch1,
  generatebatch2,
  generatebatch3
} from "../lib/openai";
import { Query } from "convex/server";

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
    return Promise.all(
      plans.map(async (plan) => ({
        ...plan,
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
    return { ...plan!, url: (plan && plan.storageId) ? await ctx.storage.getUrl(plan.storageId) : null };
  },
});

export const readPlanData = internalQuery({
  args: { id: v.id("plan") },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.id);
    return plan;
  },
});

export const IsAuthenticated = async (ctx: ActionCtx | QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    throw new ConvexError("Could not authenticate the request");
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

      // if (!IsAuthenticated(ctx)) { return null }
      console.log({ planId });

      const emptyPlan = await fetchEmptyPlan(ctx, planId);

      if (!emptyPlan) {
        throw new ConvexError("Unable to find the empty plan while preparing a new one");
        return;
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
      console.log({ planId });

      // if (!IsAuthenticated(ctx)) { return null }

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
      console.log({ planId });

      // if (!IsAuthenticated(ctx)) { return null }

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
      throw new ConvexError(`Error occured in prepare Plan Convex action: ${error}`);
    }
  },
});

//Mutation Patches after openAi responds
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

//edit in UI
export const updateActivitiesToDo = mutation({
  args: {
    planId: v.id("plan"),
    adventuresactivitiestodo: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.planId, {
      adventuresactivitiestodo: args.adventuresactivitiestodo,
    });
  },
});

export const updateLocalCuisineRecommendations = mutation({
  args: {
    planId: v.id("plan"),
    localcuisinerecommendations: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.planId, {
      localcuisinerecommendations: args.localcuisinerecommendations,
    });
  },
});

export const updatePackingChecklist = mutation({
  args: {
    planId: v.id("plan"),
    packingchecklist: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.planId, {
      packingchecklist: args.packingchecklist,
    });
  },
});


export const deleteDayInItinerary = mutation({
  args: { dayName: v.string(), planId: v.id("plan"), },
  handler: async (ctx, args) => {
    if (!IsAuthenticated(ctx)) { return null }
    const data = await ctx.db.get(args.planId);
    if (!data)
      return;
    await ctx.db.patch(args.planId, {
      itinerary: data.itinerary.filter(d => !d.title.includes(args.dayName)),
    });
  }
})

export const addDayInItinerary = mutation({
  args: {
    planId: v.id("plan"),
    itineraryDay: v.object({
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
    }),
  },
  handler: async (ctx, { planId, itineraryDay }) => {
    const data = await ctx.db.get(planId);
    if (!data)
      return;

    await ctx.db.patch(planId, {
      itinerary: [...data.itinerary, { ...itineraryDay, title: `Day ${data.itinerary.length + 1}` }],
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
