import {
  internalMutation,
  internalQuery,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";

import {v} from "convex/values";
import {Doc, Id} from "./_generated/dataModel";
import {UserJSON} from "@clerk/backend";

/**
 * Whether the current user is fully logged in, including having their information
 * synced from Clerk via webhook.
 *
 * Like all Convex queries, errors on expired Clerk token.
 */
export const userLoginStatus = query(
  async (
    ctx
  ): Promise<
    | ["No JWT Token", null]
    | ["No Clerk User", null]
    | ["Logged In", Doc<"users">]
  > => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      // no JWT token, user hasn't completed login flow yet
      return ["No JWT Token", null];
    }
    const user = await getCurrentUser(ctx);
    if (user === null) {
      // If Clerk has not told us about this user we're still waiting for the
      // webhook notification.
      return ["No Clerk User", null];
    }
    return ["Logged In", user];
  }
);

/** The current user, containing user preferences and Clerk user info. */
export const currentUser = query((ctx: QueryCtx) => getCurrentUser(ctx));

/** Get user by Clerk use id (AKA "subject" on auth)  */
export const getUser = internalQuery({
  args: {subject: v.string()},
  async handler(ctx, args) {
    return await userQuery(ctx, args.subject);
  },
});

/** Create a new Clerk user or update existing Clerk user data. */
export const updateOrCreateUser = internalMutation({
  args: {clerkUser: v.any()}, // no runtime validation, trust Clerk
  async handler(ctx, {clerkUser}: {clerkUser: UserJSON}) {
    const userRecord = await userQuery(ctx, clerkUser.id);

    if (userRecord === null) {
      await ctx.db.insert("users", {clerkUser, credit: 0});
    } else {
      await ctx.db.patch(userRecord._id, {clerkUser});
    }
  },
});

/** Set the user preference of the color of their text. */
export const setCredit = mutation({
  args: {credit: v.number()},
  handler: async (ctx, {credit}) => {
    const user = await mustGetCurrentUser(ctx);
    await ctx.db.patch(user._id, {credit});
  },
});

// Helpers

export async function userQuery(
  ctx: QueryCtx,
  clerkUserId: string
): Promise<(Omit<Doc<"users">, "clerkUser"> & {clerkUser: UserJSON}) | null> {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkUser.id", clerkUserId))
    .unique();
}

export async function userById(
  ctx: QueryCtx,
  id: Id<"users">
): Promise<(Omit<Doc<"users">, "clerkUser"> & {clerkUser: UserJSON}) | null> {
  return await ctx.db.get(id);
}

async function getCurrentUser(ctx: QueryCtx): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userQuery(ctx, identity.subject);
}

export async function mustGetCurrentUser(ctx: QueryCtx): Promise<Doc<"users">> {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}
