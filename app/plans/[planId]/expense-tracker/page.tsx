import {getAuthToken} from "@/app/auth";
import {ExpenseSheet} from "@/components/ExpenseTracker/ExpenseSheet";
import {api} from "@/convex/_generated/api";
import {fetchQuery} from "convex/nextjs";
import ExpenseTable from "@/components/ExpenseTracker/ExpenseTable";

export default async function ExpenseTracker({
  params,
  searchParams,
}: {
  params: {planId: string};
  searchParams?: {isNewPlan: string};
}) {
  const {planId} = params;

  return (
    <div className="lg:col-span-4 lg:border-l flex flex-col gap-5 px-4 py-6 lg:px-8">
      <ExpenseTable planId={planId} />
    </div>
  );
}
