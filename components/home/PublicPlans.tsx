import {getAuthToken} from "@/app/auth";
import PlanCard from "@/components/dashboard/PlanCard";
import {api} from "@/convex/_generated/api";
import {fetchQuery} from "convex/nextjs";

import React from "react";

export default async function PublicPlans() {
  const token = await getAuthToken();

  const plans = await fetchQuery(api.plan.getPublicPlans, {}, {token});

  return (
    <section
      id="public-plans"
      className="min-h-[100svh]
                     bg-background/90
                     w-full 
                     flex justify-center items-end
                     px-5 md:px-0 py-10 md:py-0"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-blue-500 text-center text-lg font-bold tracking-wide">
          Our Community's Favorite Trips
        </h2>
        <div
          className="grid grid-cols-1 
                      md:grid-cols-2 lg:grid-cols-3
                      xl:grid-cols-4 4xl:grid-cols-6
                      gap-2 p-10 justify-center"
        >
          {plans?.map((plan) => (
            <PlanCard key={plan._id} plan={plan} isPublic />
          ))}
        </div>
      </div>
    </section>
  );
}
