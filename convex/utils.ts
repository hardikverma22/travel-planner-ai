import { ConvexError } from "convex/values";
import { ActionCtx, MutationCtx, QueryCtx } from "./_generated/server";

// Cached identity check helper
export const getIdentityOrThrow = async (
  ctx: ActionCtx | QueryCtx | MutationCtx
) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Unauthorized access");
  }
  return identity;
};
