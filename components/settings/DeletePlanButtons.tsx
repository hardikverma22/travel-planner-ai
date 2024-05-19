"use client";

import {Loading} from "@/components/shared/Loading";
import {AlertDialogAction, AlertDialogCancel} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {useToast} from "@/components/ui/use-toast";
import {api} from "@/convex/_generated/api";
import {useMutation} from "convex/react";
import {ConvexError} from "convex/values";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function DeletePlanButtons({planId}: {planId: string}) {
  const deletePlan = useMutation(api.plan.deletePlan);
  const router = useRouter();
  const {toast} = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const hanleDeletePlan = async () => {
    try {
      setIsDeleting(true);
      const {id, dismiss} = toast({
        title: "Deleting Plan",
        description: "You plan is being deleted. Please wait...",
      });
      await deletePlan({planId});
      dismiss();

      router.push("/dashboard");
    } catch (error) {
      if (error instanceof ConvexError) {
        const errorMessage = (error.data as string) ?? "Something went wrong!";
        toast({
          title: "Not Allowed",
          variant: "destructive",
          description: errorMessage,
        });
      }
    }
  };

  return (
    <>
      <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
      <AlertDialogAction asChild className="destructive">
        <Button
          variant="destructive"
          className="bg-red-500 text-white hover:text-white hover:bg-red-700
                    flex gap-2 justify-center items-center"
          disabled={isDeleting}
          onClick={hanleDeletePlan}
        >
          {isDeleting && <Loading className="h-4 w-4 text-white" />}
          <span>{isDeleting ? "Deleting..." : "Delete"}</span>
        </Button>
      </AlertDialogAction>
    </>
  );
}
