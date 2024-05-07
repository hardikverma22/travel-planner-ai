import {getAuthToken} from "@/app/auth";
import {ExpenseSheet} from "@/components/expenseTracker/ExpenseSheet";
import {api} from "@/convex/_generated/api";
import {fetchQuery} from "convex/nextjs";
import ExpenseTable from "@/components/expenseTracker/ExpenseTable";

export default async function ExpenseTracker({
  params,
  searchParams,
}: {
  params: {planId: string};
  searchParams?: {isNewPlan: string};
}) {
  const {planId} = params;

  return (
    <div className="lg:col-span-4 flex flex-col gap-5 py-4">
      <ExpenseTable planId={planId} />
    </div>
  );
}
