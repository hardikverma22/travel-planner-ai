import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action, internalMutation, query } from "./_generated/server";
import { createApi } from "unsplash-js";
import { Id } from "./_generated/dataModel";

const unsplashApi = createApi({
    // Don't forget to set your access token here!
    // See https://unsplash.com/developers
    accessKey: process.env.UNSPLASH_ACCESS_KEY!
});

export const generateAndStore = action({
    args: { prompt: v.string(), planId: v.id("plan") },
    handler: async (ctx, args) => {
        const name = args.prompt.split(",")[0] ?? args.prompt;

        // Not shown: generate imageUrl from `prompt`
        const imageObject = await unsplashApi.search.getPhotos({ query: name, page: 1, perPage: 1 });
        const imageUrlExist = imageObject?.response?.results && imageObject?.response?.results.length > 0;
        if (!imageUrlExist) {
            console.log("Error getting image from unsplash");
            return null;
        }

        // Download the image
        const response = await fetch(imageObject?.response?.results[0].urls.regular!);
        const image = await response.blob();

        // Store the image in Convex
        const storageId: Id<"_storage"> = await ctx.storage.store(image);

        // Write `storageId` to a document
        await ctx.runMutation(internal.images.updateStorageId, {
            storageId,
            planId: args.planId
        });
    },
});

export const updateStorageId = internalMutation({
    args: {
        storageId: v.id("_storage"),
        planId: v.id("plan")
    },
    handler: async (ctx, { storageId, planId }) => {
        const plan = await ctx.db.get(planId);
        await ctx.db.patch(planId, {
            storageId: storageId,
            contentGenerationState: {
                ...plan!.contentGenerationState,
                imagination: true
            }
        });
    },
});

export const getImageUrl = query({
    args: { storageId: v.union(v.id("_storage"), v.null()) },
    handler: async (ctx, { storageId }) => {
        if (storageId === null)
            return null;
        const id = storageId as Id<"_storage">;
        const url = await ctx.storage.getUrl(id);
        return url;
    },
});

