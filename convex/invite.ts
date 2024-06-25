import { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getPlanAdmin } from "./plan";

export const getInvites = query({
    args: {
        planId: v.string(),
    },
    handler: async (ctx, { planId }) => {
        const admin = await getPlanAdmin(ctx, planId);
        if (!admin.isPlanAdmin) return [];
        const invites = await ctx.db
            .query("invites")
            .withIndex("by_planId", (q) => q.eq("planId", planId as Id<"plan">))
            .order("desc")
            .take(100);

        if (!invites) return [];
        const result = await Promise.all(invites.map(async invite => {
            const currentUser = await ctx.db.query("users")
                .withIndex("by_email", q => q.eq("email", invite.email))
                .first();

            return { ...invite, firstName: currentUser?.firstName, lastName: currentUser?.lastName };
        }));

        return result;
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
