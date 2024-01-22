import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  plan: defineTable({
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
    // this is UserJSON from @clerk/backend
    clerkUser: v.any(),
    credit: v.number(),
  }).index("by_clerk_id", ["clerkUser.id"]),
});
