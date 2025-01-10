"use node";
import { ConvexError, v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { Resend } from "resend";
import InviteEmail from "./InviteEmail";
import React from "react";
import { getIdentityOrThrow } from "./utils";
import { rateLimiter } from "./rateLimit";

const resend = new Resend("re_YW3HtfS5_8XD87g7Lmenhw3U6128yn7EE");

export const sendInvite = action({
  args: { planId: v.id("plan"), email: v.string() },
  async handler(ctx, args) {
    const identity = await getIdentityOrThrow(ctx);
    const { subject } = identity;
    if (!subject) return;
    // await rateLimiter.reset(ctx, "sendEmailInvite", { key: subject });
    const status = await rateLimiter.check(ctx, "sendEmailInvite", {
      key: subject,
    });
    console.log({
      rateLimitStatus: status,
      userId: subject,
      planId: args.planId,
    });
    await rateLimiter.limit(ctx, "sendEmailInvite", {
      key: subject,
      throws: true,
    });

    const result = await ctx.runQuery(api.plan.PlanAdmin, {
      planId: args.planId,
    });

    if (!result || !result.isPlanAdmin) {
      console.log(
        `${subject} is not plan admin of ${args.planId} to invite others`
      );
      throw new ConvexError("You must be a plan admin to invite others");
    }

    const { token, id } = await ctx.runMutation(api.token.createToken, {
      planId: args.planId,
      email: args.email,
    });

    const BASE_URL =
      process.env.HOSTING_URL ?? "https://travelplannerai.online";

    const { data, error } = await resend.emails.send({
      from: "Travel Planner AI <support@travelplannerai.online>",
      to: args.email,
      subject: `You've been invited to join a travel plan`,
      react: (
        <InviteEmail
          projectName={result.planName!}
          inviteLink={`${BASE_URL}/dashboard/join?token=${token}`}
        />
      ),
    });

    if (error) {
      await ctx.runMutation(api.token.deletInvite, { id });
      console.log({ error });
      throw new ConvexError({
        message: error.message,
      });
    }
  },
});
