import { Id } from "./_generated/dataModel";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getPlanAdmin } from "./plan";

export const getInvites = query({
    args: {
        planId: v.string(),
    },
    handler: async (ctx, { planId }) => {
        const admin = await getPlanAdmin(ctx, planId);
        if (!admin || !admin.isPlanAdmin) return [];
        const invites = await ctx.db
            .query("invites")
            .withIndex("by_planId", (q) => q.eq("planId", planId as Id<"plan">))
            .order("desc")
            .take(100);

        return invites;
    },
});


export const revokeInvite = mutation({
    args: {
        inviteId: v.id("invites"),
    },
    handler: async (ctx, { inviteId }) => {
        await ctx.db.delete(inviteId);
    },
});
