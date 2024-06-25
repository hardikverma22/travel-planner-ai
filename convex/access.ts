import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getPlanAdmin } from "./plan";
import { Doc } from "./_generated/dataModel";

export const getPlanAccessRecords = query({
    args: {
        planId: v.id("plan"),
    },
    handler: async (ctx, args) => {
        const admin = await getPlanAdmin(ctx, args.planId.toString());
        if (!admin.isPlanAdmin) return [];

        const accesses = await ctx.db.query("access")
            .filter(q => q.eq(q.field("planId"), args.planId))
            .collect();

        if (!accesses) return [];
        const result = await Promise.all(accesses.map(async access => {
            const currentUser = await ctx.db.query("users")
                .withIndex("by_email", q => q.eq("email", access.email))
                .first();

            return { ...access, firstName: currentUser?.firstName, lastName: currentUser?.lastName };
        }));

        return result;
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