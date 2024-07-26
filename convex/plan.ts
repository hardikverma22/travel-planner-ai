import { ActionCtx, MutationCtx, QueryCtx, action, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc, Id } from './_generated/dataModel';

import { ConvexError, v } from "convex/values";

import {
  generatebatch1,
  generatebatch2,
  generatebatch3
} from "../lib/openai";
import { getCurrentPlanSettings } from "./planSettings";

export const PlanAdmin = query({
  args: { planId: v.string() },
  handler: async (ctx, args) => {
    return getPlanAdmin(ctx, args.planId)
  },
});

export const getPlanAdmin = async (ctx: QueryCtx, planId: string) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return { isPlanAdmin: false, planName: "" };
  }

  const { subject } = identity;

  const plan = await ctx.db.get(planId as Id<"plan">);
  if (plan && plan.userId === subject) return { isPlanAdmin: true, planName: plan.nameoftheplace };
  return { isPlanAdmin: false, planName: "" };
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

export const getAllUsersForAPlan = query({
  args: {
    planId: v.id("plan"),
  },
  handler: async (ctx, args) => {

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const access = await ctx.db.query("access")
      .filter(q => q.eq(q.field("planId"), args.planId))
      .collect();

    const sharedAccessUserIds = access.map(a => a.userId);

    const planRecord = await ctx.db.get(args.planId);
    if (!planRecord) {
      throw new ConvexError("Plan Admin Not found");
    }

    sharedAccessUserIds.push(planRecord.userId);

    const result = await Promise.all(sharedAccessUserIds.map(userId => ctx.db.query("users")
      .withIndex("by_clerk_id", q => q.eq("userId", userId))
      .first())) as Doc<"users">[];

    var final = result.map(r => ({ ...r, IsCurrentUser: r.userId == identity.subject }));
    return final;
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
      combinedPlans.map(async (plan) => {
        const url = plan.storageId === null
          ? null : await ctx.storage.getUrl(plan.storageId);

        const isSharedPlan = sharedPlansIds.includes(plan._id);
        const planSettings = await ctx.db.query("planSettings").withIndex("by_planId", q => q.eq("planId", plan._id)).unique();

        return {
          ...plan,
          ...{ isSharedPlan, url },
          ...{
            fromDate: planSettings?.fromDate,
            toDate: planSettings?.toDate,
          }
        }
      })
    );

    return data;
  },
});

export const getPublicPlans = query({
  handler: async (ctx, args) => {
    const plans = await ctx.db
      .query("plan")
      .filter((q) => q.eq(q.field("userId"), "public"))
      .order("desc")
      .take(100);


    const data = await Promise.all(
      plans.map(async (plan) => ({
        ...plan,
        ...{ isSharedPlan: false },
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
  args: { id: v.id("plan"), isPublic: v.boolean() },
  handler: async (ctx, args) => {
    if (!args.isPublic) {
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

      const admin = await getPlanAdmin(ctx, args.id);

      if (!admin.isPlanAdmin && !access) {
        throw new ConvexError("The Plan you are trying to access either does not belong to you or does not exist.");
      }

      const planSettings = await getCurrentPlanSettings(ctx, plan._id);

      return {
        ...plan! as Doc<"plan">,
        url: ((plan && plan.storageId) ? await ctx.storage.getUrl(plan.storageId) : null),
        isSharedPlan: access ? true : false,
        activityPreferences: planSettings?.activityPreferences ?? [],
        fromDate: planSettings?.fromDate ?? undefined,
        toDate: planSettings?.toDate ?? undefined,
        companion: planSettings?.companion ?? undefined,
      };
    }
    else {
      const plan = await ctx.db.get(args.id);

      if (!plan) {
        throw new ConvexError("No Plan found");
      }

      if (plan.userId !== "public") {
        throw new ConvexError("Plan is not public");
      }

      return {
        ...plan!,
        url: ((plan && plan.storageId) ? await ctx.storage.getUrl(plan.storageId) : null),
        isSharedPlan: false
      };
    }

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
        Pick<Doc<"plan">, "abouttheplace" |
          "besttimetovisit">;

      await ctx.runMutation(internal.plan.updateAboutThePlaceBestTimeToVisit, {
        abouttheplace: modelName.abouttheplace,
        besttimetovisit: modelName.besttimetovisit,
        planId: emptyPlan._id
      });
    } catch (error) {
      throw new ConvexError(`Error occured in prepare Plan Convex action: ${error}`);
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

      const planMetadata = await ctx.runQuery(internal.planSettings.getPlanSettings, {
        planId: emptyPlan._id
      });

      if (!planMetadata) {
        console.error("Unable to find the plan metadata while preparing a new one");
        return null;
      };
      const { activityPreferences, companion, fromDate, toDate } = planMetadata;

      const completion = await generatebatch2({
        userPrompt: emptyPlan.userPrompt,
        activityPreferences,
        companion,
        fromDate,
        toDate
      });

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
      const planMetadata = await ctx.runQuery(internal.planSettings.getPlanSettings, {
        planId: emptyPlan._id
      });

      if (!planMetadata) {
        console.error("Unable to find the plan metadata while preparing a new one");
        return null;
      };
      const { activityPreferences, companion, fromDate, toDate } = planMetadata;

      const completion = await generatebatch3(
        { userPrompt: emptyPlan.userPrompt, activityPreferences, companion, fromDate, toDate }
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
export const updateAboutThePlaceBestTimeToVisit = internalMutation({
  args: {
    planId: v.id("plan"),
    abouttheplace: v.string(),
    besttimetovisit: v.string(),
  },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.planId);

    await ctx.db.patch(args.planId, {
      abouttheplace: args.abouttheplace,
      besttimetovisit: args.besttimetovisit,
      contentGenerationState: {
        ...plan!.contentGenerationState,
        abouttheplace: true,
        besttimetovisit: true
      }
    });
  },
});

export const updateActivitiesToDoPackingChecklistLocalCuisineRecommendations = internalMutation({
  args: {
    planId: v.id("plan"),
    adventuresactivitiestodo: v.array(v.string()),
    packingchecklist: v.array(v.string()),
    localcuisinerecommendations: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.planId);

    await ctx.db.patch(args.planId, {
      adventuresactivitiestodo: args.adventuresactivitiestodo,
      packingchecklist: args.packingchecklist,
      localcuisinerecommendations: args.localcuisinerecommendations,
      contentGenerationState: {
        ...plan!.contentGenerationState,
        adventuresactivitiestodo: true,
        packingchecklist: true,
        localcuisinerecommendations: true
      }
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
    const plan = await ctx.db.get(args.planId);

    await ctx.db.patch(args.planId, {
      topplacestovisit: args.topplacestovisit,
      itinerary: args.itinerary,
      contentGenerationState: {
        ...plan!.contentGenerationState,
        topplacestovisit: true,
        itinerary: true,
      }
    });
  },
});

//edit in UI

export const updatePartOfPlan = mutation({
  args: {
    planId: v.id("plan"),
    data: v.union(v.string(), v.array(v.string()), v.array(v.object({
      name: v.string(),
      coordinates: v.object({
        lat: v.float64(),
        lng: v.float64()
      })
    }))),
    key: v.union(v.literal("abouttheplace"),
      v.literal("besttimetovisit"),
      v.literal("packingchecklist"),
      v.literal("localcuisinerecommendations"),
      v.literal("adventuresactivitiestodo"),
      v.literal("topplacestovisit"))
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.planId, {
      [args.key]: args.data,
    });
  },
})

export const updatePlaceToVisit = mutation({
  args: {
    planId: v.id("plan"),
    lat: v.float64(),
    lng: v.float64(),
    placeName: v.string(),
  },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.planId);
    if (!plan) return;
    const existing = plan?.topplacestovisit;
    await ctx.db.patch(plan?._id, {
      topplacestovisit: [...existing, {
        name: args.placeName,
        coordinates: {
          lat: args.lat,
          lng: args.lng
        }
      }]
    })
  },
})

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
    placeName: v.string(),
    noOfDays: v.string(),
    activityPreferences: v.array(v.string()),
    fromDate: v.number(),
    toDate: v.number(),
    companion: v.optional(v.string()),
    isGeneratedUsingAI: v.boolean()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      console.log("no identity");
      return null;
    }

    const state = args.isGeneratedUsingAI ? false : true;

    const newPlan = await ctx.db.insert("plan", {
      nameoftheplace: args.placeName,
      abouttheplace: "",
      adventuresactivitiestodo: [],
      topplacestovisit: [],
      userId: identity.subject,
      userPrompt: `${args.noOfDays} days trip to ${args.placeName}`,
      besttimetovisit: "",
      itinerary: [],
      storageId: null,
      localcuisinerecommendations: [],
      packingchecklist: [],
      isGeneratedUsingAI: args.isGeneratedUsingAI,
      contentGenerationState: {
        imagination: state,
        abouttheplace: state,
        adventuresactivitiestodo: state,
        besttimetovisit: state,
        itinerary: state,
        localcuisinerecommendations: state,
        packingchecklist: state,
        topplacestovisit: state
      }
    });

    await ctx.db.insert("planSettings", {
      planId: newPlan,
      userId: identity.subject,
      activityPreferences: args.activityPreferences,
      fromDate: args.fromDate,
      toDate: args.toDate,
      companion: args.companion,
    })

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
      throw new ConvexError("There is no such plan to delete with the given Id")
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

    const planSettings = await ctx.db.query("planSettings").withIndex("by_planId", q => q.eq("planId", planId)).unique();
    if (planSettings)
      await ctx.db.delete(planSettings?._id);

    await ctx.db.delete(planId);
  }
});