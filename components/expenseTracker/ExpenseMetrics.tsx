"use client";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Doc} from "@/convex/_generated/dataModel";
import {DollarSignIcon} from "lucide-react";
import expense from "@/public/expense.svg";
import {ReactNode, useMemo} from "react";
import {expenseCategories} from "@/lib/constants";
import {cn} from "@/lib/utils";

const ExpenseMetrics = ({
  expenses,
  preferredCurrency,
}: {
  preferredCurrency: string;
  expenses: (Doc<"expenses"> & {email: string})[];
}) => {
  if (!expenses || expenses.length === 0) return null;

  const totalExpenses = useMemo(
    () => expenses.reduce((total, expense) => total + expense.amount, 0),
    expenses
  );

  const highestExpense = useMemo(
    () =>
      expenses.reduce((prev, curr) => {
        if (prev.amount > curr.amount) return prev;
        else return curr;
      }),
    expenses
  );

  const categoryCounts: {[key in Doc<"expenses">["category"]]: number} = {
    food: 0,
    commute: 0,
    shopping: 0,
    gifts: 0,
    accomodations: 0,
    others: 0,
  };

  const mostCommonCategory = useMemo(
    () =>
      expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, categoryCounts),
    expenses
  );

  type CategoryKey = keyof typeof mostCommonCategory;

  const topCategory = (Object.keys(mostCommonCategory) as CategoryKey[]).reduce((a, b) =>
    mostCommonCategory[a] > mostCommonCategory[b] ? a : b
  );

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: preferredCurrency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
    expenses
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-4">
      <MetricCard
        title="Total Expense"
        amount={totalExpenses}
        subtext="total spent on the plan"
        icon={<DollarSignIcon className="h-4 w-4 text-muted-foreground" />}
        formatter={formatter}
        bgColor="bg-green-50"
      />
      <MetricCard
        title="Most Spent Category"
        amount={categoryCounts[topCategory]}
        subtext={topCategory.toUpperCase()}
        icon={expenseCategories.find((c) => c.key.includes(topCategory))?.icon}
        formatter={formatter}
        bgColor="bg-purple-50"
      />
      <MetricCard
        title="Highest Single Expense"
        amount={highestExpense.amount}
        subtext={`spent on ${highestExpense.category.toUpperCase()}`}
        icon={<DollarSignIcon className="h-4 w-4 text-muted-foreground" />}
        formatter={formatter}
        bgColor="bg-red-50"
      />
    </div>
  );
};

const MetricCard = ({
  title,
  amount,
  subtext,
  icon,
  formatter,
  bgColor,
}: {
  title: string;
  amount: number;
  subtext: string;
  icon: ReactNode;
  formatter: Intl.NumberFormat;
  bgColor: string;
}) => {
  return (
    <Card className={cn("flex flex-col h-full justify-between", `dark:bg-card ${bgColor}`)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-2xl font-bold tracking-wider">{formatter.format(amount)}</div>
        <p className="text-xs text-muted-foreground">{subtext}</p>
      </CardContent>
    </Card>
  );
};

export default ExpenseMetrics;
