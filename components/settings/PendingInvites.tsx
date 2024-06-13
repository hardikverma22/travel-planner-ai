"use client";

import {Button} from "@/components/ui/button";
import {useToast} from "@/components/ui/use-toast";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {useMutation, useQuery} from "convex/react";
import {ConvexError} from "convex/values";
import {getDisplayName} from "@/lib/utils";
import {useTransition} from "react";

const PendingInvites = ({planId}: {planId: string}) => {
  const invites = useQuery(api.invite.getInvites, {planId});
  const revokeInvite = useMutation(api.invite.revokeInvite);
  const {toast} = useToast();
  const [isPending, startTransition] = useTransition();

  if (!invites || invites.length == 0) return null;

  const revokeEmailInvite = async (id: Id<"invites">, email: string) => {
    try {
      startTransition(async () => {
        await revokeInvite({inviteId: id});
      });
      toast({
        variant: "default",
        description: `Invite to ${email} has been revoked.`,
      });
    } catch (error) {
      if (error instanceof ConvexError) {
        toast({
          title: "Error",
          description: (error.data as {message: string}).message,
        });
      }
    }
  };

  return (
    <div className="mt-5">
      <div className="mb-2 font-bold text-sm">Pending Invites</div>
      <div className="flex flex-col gap-3 max-w-lg">
        {invites.map((invite) => (
          <div
            key={invite._id}
            className="px-5 py-2 
                        border border-solid border-border 
                        shadow-sm rounded-md
                        flex gap-5 justify-between items-center"
          >
            <span className="text-sm text-muted-foreground">
              {getDisplayName(invite.firstName, invite?.lastName, invite?.email)}
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => revokeEmailInvite(invite._id, invite.email)}
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

export default PendingInvites;
