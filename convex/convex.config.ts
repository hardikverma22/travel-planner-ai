// convex/convex.config.ts
import { defineApp } from "convex/server";
import aggregate from "@convex-dev/aggregate/convex.config";
import rateLimiter from "@convex-dev/rate-limiter/convex.config";

const app = defineApp();
app.use(aggregate, { name: "publishedPlansWithCompanion" });
app.use(aggregate, { name: "allPublishedPlans" });

app.use(rateLimiter);
export default app;
