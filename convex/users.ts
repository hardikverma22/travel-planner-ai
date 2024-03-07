import {
  internalMutation,
  internalQuery,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";

import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

/** Get user by Clerk use id (AKA "subject" on auth)  */
export const getUser = internalQuery({
  args: { subject: v.string() },
  async handler(ctx, args) {
    return await userQuery(ctx, args.subject);
  },
});

/** Create a new Clerk user or update existing Clerk user data. */
export const createUser = internalMutation({
  args: { userId: v.string(), email: v.string() }, // no runtime validation, trust Clerk
  async handler(ctx, { userId, email }) {
    const userRecord = await userQuery(ctx, userId);

    if (userRecord === null) {
      await ctx.db.insert("users", { userId, credits: 0, email, freeCredits: 2 });
    }
  },
});

export const reduceUserCreditsByOne = internalMutation({
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const userRecord = await userQuery(ctx, identity.subject);

    if (userRecord != null) {
      if (userRecord.freeCredits > 0) {
        await ctx.db.patch(userRecord._id, { freeCredits: userRecord.freeCredits - 1 });
      } else {
        await ctx.db.patch(userRecord._id, { credits: userRecord.credits - 1 });

      }
    }
  },
});


export const updateUserCredits = async (ctx: MutationCtx, userId: string) => {

  const user_object = await userQuery(ctx, userId);

  if (user_object != null)
    await ctx.db.patch(user_object._id, { credits: (user_object?.credits ?? 0) + 5 });
};

// Helpers

export async function userQuery(
  ctx: QueryCtx,
  clerkUserId: string
) {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("userId", clerkUserId))
    .unique();
}

/** The current user, containing user preferences and Clerk user info. */
export const currentUser = query((ctx: QueryCtx) => getCurrentUser(ctx));


async function getCurrentUser(ctx: QueryCtx): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userQuery(ctx, identity.subject);
}