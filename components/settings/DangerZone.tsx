import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {Button} from "@/components/ui/button";
import DeletePlanButton from "./DeletePlanButtons";

export default function DangerZone({planId}: {planId: string}) {
  return (
    <article className="bg-background shadow-sm rounded-lg p-4 border-2 border-border">
      <div className="border-b-2 border-b-border pb-2 mb-2 font-bold text-red-500">Danger Zone</div>

      <span className="text-neutral-500 dark:text-neutral-400 mb-4 flex text-sm sm:text-base">
        You can delete your travel plan but please be informed that it can not be recoved.
      </span>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete Travel Plan</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Travel Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Please type Delete to delete this plan. After deletion, it can not be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <DeletePlanButton planId={planId} />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </article>
  );
}
