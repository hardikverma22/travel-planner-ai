import ExpenseTable from "@/components/expenseTracker/ExpenseTable";

export default async function ExpenseTracker({params}: {params: {planId: string}}) {
  const {planId} = params;

  return (
    <div className="lg:col-span-4 flex flex-col gap-5 py-4">
      <ExpenseTable planId={planId} />
    </div>
  );
}
