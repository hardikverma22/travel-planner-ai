import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action, internalMutation, query } from "./_generated/server";
import { createApi } from "unsplash-js";
import { Id } from "./_generated/dataModel";
import { getIdentityOrThrow } from "./utils";

const unsplashApi = createApi({
  // Don't forget to set your access token here!
  // See https://unsplash.com/developers
  accessKey: process.env.UNSPLASH_ACCESS_KEY!,
});

export const generateAndStore = action({
  args: { prompt: v.string(), planId: v.id("plan") },
  handler: async (ctx, { planId, prompt }) => {
    const name = prompt.split(",")[0] ?? prompt;

    // Not shown: generate imageUrl from `prompt`
    const imageObject = await unsplashApi.search.getPhotos({
      query: name,
      page: 1,
      perPage: 1,
    });
    const imageUrlExist =
      imageObject?.response?.results &&
      imageObject?.response?.results.length > 0;
    if (!imageUrlExist) {
      console.log(`Error getting image from unsplash planId: ${planId}`);
      return null;
    }

    // Download the image
    const response = await fetch(
      imageObject?.response?.results[0].urls.regular!
    );
    const image = await response.blob();

    // Store the image in Convex
    const storageId: Id<"_storage"> = await ctx.storage.store(image);

    const imageUrl = await ctx.storage.getUrl(storageId);
    if (!imageUrl && !imageUrl) {
      console.log(`could not generate image url from convex planId: ${planId}`);
      return;
    }

    // Write `storageId` to a document
    await ctx.runMutation(internal.images.updateStorageId, {
      storageId,
      planId,
      imageUrl,
    });
  },
});

export const updateStorageId = internalMutation({
  args: {
    storageId: v.id("_storage"),
    planId: v.id("plan"),
    imageUrl: v.string(),
  },
  handler: async (ctx, { storageId, planId, imageUrl }) => {
    const plan = await ctx.db.get(planId);
    await ctx.db.patch(planId, {
      storageId: storageId,
      imageUrl,
      contentGenerationState: {
        ...plan!.contentGenerationState,
        imagination: true,
      },
    });
  },
});

export const getImageUrl = query({
  args: { storageId: v.union(v.id("_storage"), v.null()) },
  handler: async (ctx, { storageId }) => {
    if (storageId === null) return null;
    const id = storageId as Id<"_storage">;
    const url = await ctx.storage.getUrl(id);
    return url;
  },
});
