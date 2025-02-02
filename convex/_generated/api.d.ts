/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as access from "../access.js";
import type * as cleanup from "../cleanup.js";
import type * as communityPlans from "../communityPlans.js";
import type * as email from "../email.js";
import type * as expenses from "../expenses.js";
import type * as feedback from "../feedback.js";
import type * as http from "../http.js";
import type * as images from "../images.js";
import type * as invite from "../invite.js";
import type * as InviteEmail from "../InviteEmail.js";
import type * as lib from "../lib.js";
import type * as payments from "../payments.js";
import type * as plan from "../plan.js";
import type * as planSettings from "../planSettings.js";
import type * as rateLimit from "../rateLimit.js";
import type * as razorpay from "../razorpay.js";
import type * as retrier from "../retrier.js";
import type * as token from "../token.js";
import type * as users from "../users.js";
import type * as utils from "../utils.js";
import type * as weather from "../weather.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  access: typeof access;
  cleanup: typeof cleanup;
  communityPlans: typeof communityPlans;
  email: typeof email;
  expenses: typeof expenses;
  feedback: typeof feedback;
  http: typeof http;
  images: typeof images;
  invite: typeof invite;
  InviteEmail: typeof InviteEmail;
  lib: typeof lib;
  payments: typeof payments;
  plan: typeof plan;
  planSettings: typeof planSettings;
  rateLimit: typeof rateLimit;
  razorpay: typeof razorpay;
  retrier: typeof retrier;
  token: typeof token;
  users: typeof users;
  utils: typeof utils;
  weather: typeof weather;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  rateLimiter: {
    lib: {
      checkRateLimit: FunctionReference<
        "query",
        "internal",
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          count?: number;
          key?: string;
          name: string;
          reserve?: boolean;
          throws?: boolean;
        },
        { ok: true; retryAfter?: number } | { ok: false; retryAfter: number }
      >;
      clearAll: FunctionReference<
        "mutation",
        "internal",
        { before?: number },
        null
      >;
      rateLimit: FunctionReference<
        "mutation",
        "internal",
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          count?: number;
          key?: string;
          name: string;
          reserve?: boolean;
          throws?: boolean;
        },
        { ok: true; retryAfter?: number } | { ok: false; retryAfter: number }
      >;
      resetRateLimit: FunctionReference<
        "mutation",
        "internal",
        { key?: string; name: string },
        null
      >;
    };
  };
};
