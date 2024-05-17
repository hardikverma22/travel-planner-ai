"use client";

import DataTable from "@/components/expenseTracker/DataTable";

import {api} from "@/convex/_generated/api";
import {useQuery} from "convex/react";
import Image from "next/image";
import expense from "@/public/expense.svg";
import LoadingComponent from "@/app/plans/[planId]/expense-tracker/loading";
import dynamic from "next/dynamic";
const ExpenseSheet = dynamic(() => import("@/components/expenseTracker/ExpenseSheet"));

const ExpenseSection = ({planId}: {planId: string}) => {
  const data = useQuery(api.expenses.getExpenses, {planId: planId});

  if (!data) return <LoadingComponent />;

  if (data && data.length == 0)
    return (
      <div
        className="flex flex-col justify-center items-center gap-2
                      border-2 border-border rounded-xl w-full h-full
                      shadow-xl font-sans"
      >
        <p className="font-semibold text-lg md:text-xl">You haven't added any Expenses yet!</p>
        <p className="px-8 max-w-xl text-base text-center text-muted-foreground">
          Effortlessly Track Your Expenses and Stay On Budget!
        </p>
        <Image
          alt="Empty Cart"
          src={expense}
          width={300}
          height={300}
          className="bg-contain py-10"
        />
        <ExpenseSheet planId={planId} />
      </div>
    );

  if (data)
    return (
      <>
        <div className="flex justify-between items-end w-full border-b-2 pb-1">
          <h2 className="font-semibold font-sans text-xl align-bottom">Expenses</h2>
          <ExpenseSheet planId={planId} />
        </div>
        <DataTable data={data} />
      </>
    );
};

export default ExpenseSection;
