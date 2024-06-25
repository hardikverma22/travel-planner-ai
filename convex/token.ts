import { mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getPlanAdmin } from "./plan";

export function generateToken() {
    const array = new Uint8Array(12);
    crypto.getRandomValues(array);
    const token = Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
    return token;
}

export const createToken = mutation({
    args: { planId: v.id("plan"), email: v.string() },
    async handler(ctx, args) {
        const invite = await ctx.db.query('invites')
            .withIndex("by_planId_email", q => q.eq("planId", args.planId).eq("email", args.email))
            .first();

        if (invite) {
            throw new ConvexError("Invite already sent to this user");
        }

        const token = generateToken();

        await ctx.db.insert("invites", {
            planId: args.planId,
            email: args.email,
            token
        })

        return token;
    }
})

export const grantAccessByToken = mutation({
    args: { token: v.string() },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Not authorized to perform to check for Plan Admin")
        }

        const invite = await ctx.db.query('invites')
            .withIndex("by_token", q => q.eq("token", args.token))
            .first();

        if (!invite) {
            throw new ConvexError("no invite found with the provided token");
        }

        const userToAdd = await ctx.db.query('users')
            .withIndex("by_email", q => q.eq("email", invite.email))
            .first();

        if (!userToAdd) {
            throw new ConvexError("no user found with the meail while giving acces to a plan");
        }

        const plan = await ctx.db.get(invite.planId);

        if (!plan) {
            throw new ConvexError(`No Plan found while giving access to user ${userToAdd.userId}`);
        }

        const adminAccess = await getPlanAdmin(ctx, plan._id);

        if (adminAccess.isPlanAdmin) {
            throw new ConvexError(`You can't join the plan you already own.`);
        }

        await ctx.db.insert("access", {
            planId: plan._id,
            userId: userToAdd.userId,
            email: userToAdd.email
        })

        await ctx.db.delete(invite._id);

        return plan._id;
    },
})