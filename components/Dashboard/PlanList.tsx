import {getAuthToken} from "@/app/auth";
import {NoPlans} from "@/components/Dashboard/NoPlans";
import PlanCard from "@/components/Dashboard/PlanCard";
import {api} from "@/convex/_generated/api";
import {fetchQuery} from "convex/nextjs";

export async function PlanList() {
  const token = await getAuthToken();
  let plans = await fetchQuery(api.plan.getPlanForAUser, {}, {token});

  if (!plans || plans.length == 0) return <NoPlans />;

  return (
    <section
      className="grid grid-cols-1 
                      md:grid-cols-2 lg:grid-cols-3
                      2xl:grid-cols-4 4xl:grid-cols-6
                      gap-5 p-10 justify-center"
    >
      {!plans || plans.length == 0 ? (
        <NoPlans />
      ) : (
        plans.map((plan) => <PlanCard key={plan._id} plan={plan} />)
      )}
    </section>
  );
}

export default PlanList;
