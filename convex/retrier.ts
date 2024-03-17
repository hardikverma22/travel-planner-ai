/**
 * This file defines a `runAction` helper function that can be used to retry a
 * Convex action until it succeeds. An action should only be retried if it is
 * safe to do so, i.e., if it's idempotent or doesn't have any unsafe side effects.
 */

import { internalMutation, mutation } from "./_generated/server";
import { makeFunctionReference } from "convex/server";
import { internal } from "./_generated/api";
import { ConvexError, v } from "convex/values";

const DEFAULT_WAIT_BACKOFF = 10;
const DEFAULT_RETRY_BACKOFF = 10;
const DEFAULT_BASE = 2;
const DEFAULT_MAX_FAILURES = 16;

/**
 * Run and retry action until it succeeds or fails too many times.
 *
 * @param action - Name of the action to run, e.g., `usercode:maybeAction`.
 * @param actionArgs - Arguments to pass to the action, e.g., `{"failureRate": 0.75}`.
 * @param [waitBackoff=DEFAULT_WAIT_BACKOFF (10)] - Initial delay before checking action status, in milliseconds.
 * @param [retryBackoff=DEFAULT_RETRY_BACKOFF (10)] - Initial delay before retrying, in milliseconds.
 * @param [base=DEFAULT_BASE (2)] - Base of the exponential backoff.
 * @param [maxFailures=DEFAULT_MAX_FAILURES (16)] - The maximum number of times to retry the action.
 */
export const runAction = mutation({
    args: {
        action: v.string(),
        actionArgs: v.any(),
        waitBackoff: v.optional(v.number()),
        retryBackoff: v.optional(v.number()),
        base: v.optional(v.number()),
        maxFailures: v.optional(v.number()),
    },
    handler: async (
        ctx,
        {
            action,
            actionArgs,
            waitBackoff = DEFAULT_WAIT_BACKOFF,
            retryBackoff = DEFAULT_RETRY_BACKOFF,
            base = DEFAULT_BASE,
            maxFailures = DEFAULT_MAX_FAILURES,
        }
    ) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity == null) {
            throw new ConvexError("Not Authenticated");
        }

        const job = await ctx.scheduler.runAfter(
            0,
            makeFunctionReference<"action">(action),
            actionArgs,
        );

        await ctx.scheduler.runAfter(0, internal.retrier.retry, {
            job,
            action,
            actionArgs,
            waitBackoff,
            retryBackoff,
            base,
            maxFailures,
        });
    },

});

export const retry = internalMutation({
    args: {
        job: v.id("_scheduled_functions"),
        action: v.string(),
        actionArgs: v.any(),
        waitBackoff: v.number(),
        retryBackoff: v.number(),
        base: v.number(),
        maxFailures: v.number(),
    },
    handler: async (ctx, args) => {
        const { job } = args;
        const status = await ctx.db.system.get(job);
        if (!status) {
            throw new Error(`Job ${job} not found`);
        }

        switch (status.state.kind) {
            case "pending":
            case "inProgress":
                console.log(
                    `Job ${job} not yet complete, checking again in ${args.waitBackoff} ms. action: ${args.action}`
                );
                await ctx.scheduler.runAfter(args.waitBackoff, internal.retrier.retry, {
                    ...args,
                    waitBackoff: args.waitBackoff * args.base,
                });
                break;

            case "failed":
                if (args.maxFailures <= 0) {
                    console.log(`Job ${job} failed too many times, not retrying.  action: ${args.action}`);
                    break;
                }
                console.log(`Job ${job} failed, retrying in ${args.retryBackoff} ms.  action: ${args.action}`);
                const newJob = await ctx.scheduler.runAfter(
                    args.retryBackoff,
                    makeFunctionReference<"action">(args.action),
                    args.actionArgs
                );
                await ctx.scheduler.runAfter(
                    args.retryBackoff,
                    internal.retrier.retry,
                    {
                        ...args,
                        job: newJob,
                        retryBackoff: args.retryBackoff * args.base,
                        maxFailures: args.maxFailures - 1,
                    }
                );
                break;

            case "success":
                console.log(`Job ${job} succeeded.  action: ${args.action}`);
                break;
            case "canceled":
                console.log(`Job ${job} was canceled. Not retrying.  action: ${args.action}`);
                break;
        }
    },
});