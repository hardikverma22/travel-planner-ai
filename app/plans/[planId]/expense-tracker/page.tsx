import ExpenseTable from "@/components/expenseTracker/ExpenseTable";

export default async function ExpenseTracker({params}: {params: {planId: string}}) {
  const {planId} = params;

  return <ExpenseTable planId={planId} />;
}
