import {Button} from "@/components/ui/button";
import {useToast} from "@/components/ui/use-toast";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {useMutation, useQuery} from "convex/react";
import {ConvexError} from "convex/values";
import {useTransition} from "react";

const AccessRecords = ({planId}: {planId: string}) => {
  const records = useQuery(api.plan.getPlanAccessRecords, {
    planId: planId as Id<"plan">,
  });
  const revokeAccess = useMutation(api.plan.revokeAccess);
  const {toast} = useToast();
  const [isPending, startTransition] = useTransition();

  const revokeEmailInvite = async (id: Id<"access">, email: string) => {
    startTransition(async () => {
      await revokeAccess({id});
    });
    toast({
      variant: "default",
      description: `Access of this plan from ${email} has been revoked.`,
    });
  };

  if (!records || records.length === 0) return null;
  return (
    <div className="mt-5">
      <div className="mb-2 font-bold text-sm">People having access to this plan</div>
      <div className="flex flex-col gap-3 w-96">
        {records.map((record) => (
          <div
            className="px-5 py-2 
                        border border-solid border-gray-300 
                        shadow-sm rounded-md
                        flex gap-5 justify-between items-center"
          >
            <span className="text-sm text-gray-500">{record.email}</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => revokeEmailInvite(record._id, record.email)}
              disabled={isPending}
            >
              Revoke
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccessRecords;
