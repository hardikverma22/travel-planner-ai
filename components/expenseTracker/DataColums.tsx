import ExpenseSheet from "@/components/expenseTracker/ExpenseSheet";
import {expenseCategories} from "@/lib/constants";
import {Checkbox} from "@/components/ui/checkbox";
import {Doc} from "@/convex/_generated/dataModel";
import {CaretSortIcon} from "@radix-ui/react-icons";
import {ColumnDef} from "@tanstack/react-table";
import {Button} from "@/components/ui/button";
import DropDownActions from "@/components/expenseTracker/DropDownActions";

export const getColumns = (currency: string): ColumnDef<Doc<"expenses"> & {whoSpent: string}>[] => {
  return [
    {
      id: "select",
      header: ({table}) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({row}) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "purpose",
      header: () => <div className="text-left">For</div>,
      cell: ({row}) => (
        <ExpenseSheet
          planId={row.original.planId}
          edit
          data={row.original}
          preferredCurrency={currency}
        />
      ),
    },
    {
      accessorKey: "whopaid",
      header: () => <div className="text-left">Who Spent</div>,
      cell: ({row}) => <div className="text-left font-medium">{row.original.whoSpent}</div>,
    },
    {
      accessorKey: "category",
      header: ({column}) => {
        return (
          <div className="text-left">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Category
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({row}) => (
        <div className="lowercase text-left flex gap-1 ml-4 items-center">
          {expenseCategories.find((e) => e.key === row.original.category)?.icon}
          {row.getValue("category")}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({row}) => {
        const amount = parseFloat(row.getValue("amount"));

        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency || "INR",
        }).format(amount);

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "date",
      header: () => <div className="text-right">Date</div>,
      cell: ({row}) => {
        const date = row.getValue("date") as string;
        const formatted = new Date(date);

        return (
          <div className="text-right font-medium">
            {formatted.toLocaleDateString("en-us", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        );
      },
    },

    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({row}) => (
        <div className="text-right">
          <DropDownActions row={row} />
        </div>
      ),
    },
  ];
};
