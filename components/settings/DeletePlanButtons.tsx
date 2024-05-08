"use client";

import {Loading} from "@/components/shared/Loading";
import {AlertDialogAction, AlertDialogCancel} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {api} from "@/convex/_generated/api";
import {useMutation} from "convex/react";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function DeletePlanButtons({planId}: {planId: string}) {
  const deletePlan = useMutation(api.plan.deletePlan);
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <>
      <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
      <AlertDialogAction asChild className="destructive">
        <Button
          variant="destructive"
          className="bg-red-500 text-white hover:text-white hover:bg-red-700
                    flex gap-2 justify-center items-center"
          disabled={isDeleting}
          onClick={async () => {
            setIsDeleting(true);
            await deletePlan({planId});
            router.push("/dashboard");
          }}
        >
          {isDeleting && <Loading className="h-4 w-4 text-white" />}
          <span>{isDeleting ? "Deleting..." : "Delete"}</span>
        </Button>
      </AlertDialogAction>
    </>
  );
}
