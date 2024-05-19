import { ActionCtx, MutationCtx, QueryCtx, action, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc, Id } from './_generated/dataModel';

import { ConvexError, v } from "convex/values";

import {
  generatebatch1,
  generatebatch2,
  generatebatch3
} from "../lib/openai";

export const PlanAdmin = query({
  args: { planId: v.string() },
  handler: async (ctx, args) => {
    return getPlanAdmin(ctx, args.planId)
  },
});

export const getPlanAdmin = async (ctx: QueryCtx, planId: string) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }

  const { subject } = identity;

  const plan = await ctx.db.get(planId as Id<"plan">);
  if (plan && plan.userId === subject) return { isPlanAdmin: true, planName: plan.nameoftheplace };
  return { isPlanAdmin: false, planName: null };
}

const getSharedPlans = async (ctx: QueryCtx, userId: string) => {

  const access = await ctx.db.query("access")
    .withIndex("by_userId", q => q.eq("userId", userId))
    .take(100);

  const planIds = access.map(a => a.planId);

  const promises = planIds.map(async planId => {
    const plan = await ctx.db.get(planId);
    return plan!;
  })

  return Promise.all(promises);
}

export const getPlanAccessRecords = query({
  args: {
    planId: v.id("plan"),
  },
  handler: async (ctx, args) => {
    const admin = await getPlanAdmin(ctx, args.planId.toString());
    if (!admin || !admin.isPlanAdmin) return [];

    const access = await ctx.db.query("access")
      .filter(q => q.eq(q.field("planId"), args.planId))
      .collect();

    return access;
  },
});

export const getAllUsersForAPlan = query({
  args: {
    planId: v.id("plan"),
  },
  handler: async (ctx, args) => {

    const access = await ctx.db.query("access")
      .filter(q => q.eq(q.field("planId"), args.planId))
      .collect();

    const sharedAccess = access.map(a => ({ userId: a.userId, email: a.email }));
    const planRecord = await ctx.db.get(args.planId);
    if (planRecord) {

      const ownerAccess = await ctx.db.query("users")
        .withIndex("by_clerk_id", q => q.eq("userId", planRecord.userId))
        .first();
      if (ownerAccess)
        sharedAccess.push({ email: ownerAccess?.email, userId: ownerAccess?.userId })

    }
    return sharedAccess;
  },
});

export const revokeAccess = mutation({
  args: { id: v.id("access") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    await ctx.db.delete(args.id);
  },
});

export const getAllPlansForAUser = query({
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

    const sharedPlans = await getSharedPlans(ctx, subject);
    const sharedPlansIds = sharedPlans.map(s => s._id);
    const combinedPlans = plans.concat(sharedPlans);

    const data = await Promise.all(
      combinedPlans.map(async (plan) => ({
        ...plan,
        ...{ isSharedPlan: sharedPlansIds.includes(plan._id) },
        ...(plan.storageId === null
          ? { url: null }
          : { url: await ctx.storage.getUrl(plan.storageId) }),
      }))
    );

    return data;
  },
});

export const getComboBoxPlansForAUser = query({
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const { subject } = identity;

    const ownPlans = await ctx.db
      .query("plan")
      .filter((q) => q.eq(q.field("userId"), subject))
      .order("desc")
      .take(100);

    const sharedPlans = await getSharedPlans(ctx, subject);
    const allPlans = ownPlans.concat(sharedPlans);

    return allPlans;
  },
});

export const getSinglePlan = query({
  args: { id: v.id("plan") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const { subject } = identity;

    const access = await ctx.db.query("access")
      .withIndex("by_planId_userId", q => q.eq("planId", args.id).eq("userId", subject))
      .first();

    const plan = await ctx.db.get(args.id);

    if (!plan) {
      throw new ConvexError("No Plan found");
    }

    const admin = getPlanAdmin(ctx, args.id);

    if (!admin && !access) {
      throw new ConvexError("The Plan you are trying to access either does not belong to you or does not exist.");
    }

    return {
      ...plan!,
      url: ((plan && plan.storageId) ? await ctx.storage.getUrl(plan.storageId) : null),
      isSharedPlan: access ? true : false
    };
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

export const deletePlan = mutation({
  args: { planId: v.string() },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      console.log("Not logged in to delete a user");
      return null;
    }

    const planId = args.planId as Id<"plan">;

    const plan = await ctx.db.get(planId);

    if (!plan) {
      throw new ConvexError("There is no such plan to dlete with the given Id")
    }

    if (plan.userId !== identity.subject) {
      throw new ConvexError("You are not the owner of this plan.")
    }
    if (plan.storageId)
      await ctx.storage.delete(plan.storageId as Id<"_storage">);

    const expenseIds = (await ctx.db.query("expenses").withIndex("by_planId", q => q.eq("planId", planId)).collect()).map(ex => ex._id);
    await Promise.all(expenseIds.map((id) => ctx.db.delete(id)));

    const accessIds = (await ctx.db.query("access").withIndex("by_planId", q => q.eq("planId", planId)).collect()).map(ex => ex._id);
    await Promise.all(accessIds.map((id) => ctx.db.delete(id)));

    const inviteIds = (await ctx.db.query("invites").withIndex("by_planId", q => q.eq("planId", planId)).collect()).map(ex => ex._id);
    await Promise.all(inviteIds.map((id) => ctx.db.delete(id)));

    await ctx.db.delete(planId);
  }
})