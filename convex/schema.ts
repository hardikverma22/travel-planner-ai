import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  plan: defineTable({
    storageId: v.union(v.id("_storage"), v.null()),
    nameoftheplace: v.string(),
    userPrompt: v.string(),
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
    besttimetovisit: v.string(),
    itinerary: v.array(v.object({
      title: v.string(),
      activities: v.object({
        morning: v.array(v.string()),
        afternoon: v.array(v.string()),
        evening: v.array(v.string())
      })
    }))
  }),
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    credits: v.number(),
  }).index("by_clerk_id", ["userId"]),
  payments: defineTable({
    userId: v.string(),
    stripeId: v.string(),
    status: v.string()
  }).index("by_stripe_id", ["stripeId"]),
});
