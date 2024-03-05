import { z } from "zod";

export const ItineraryValidationSchema = z.object({
    itinerary: z.object({
        title: z.string(),
        activities: z.object({
            morning: z.array(
                z.object({
                    itineraryItem: z.string().min(3),
                    briefDescription: z.string().min(3),
                })
            ),
            afternoon: z.array(
                z.object({
                    itineraryItem: z.string().min(3),
                    briefDescription: z.string().min(3),
                })
            ),
            evening: z.array(
                z.object({
                    itineraryItem: z.string().min(3),
                    briefDescription: z.string().min(3),
                })
            ),
        }),
    }),
});