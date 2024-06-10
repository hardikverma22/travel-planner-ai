import {SelectItem} from "@/components/ui/select";
import {UserIcon} from "lucide-react";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Doc, Id} from "@/convex/_generated/dataModel";
import {cn} from "@/lib/utils";

const UserDropdown = ({planId, userId}: {planId: string; userId: string}) => {
  const sharedUserList = useQuery(api.plan.getAllUsersForAPlan, {
    planId: planId as Id<"plan">,
  });

  const getDisplayName = (userObject: Doc<"users">) => {
    if (!userObject.firstName && !userObject.lastName) return userObject.email;
    if (userObject.firstName && userObject.firstName.length > 0)
      return userObject.firstName + (userObject.lastName ? ` ${userObject.lastName}` : "");
  };

  return sharedUserList?.map((userObject) => (
    <SelectItem value={userObject.userId} key={userObject.userId}>
      <div className="flex gap-2 items-center">
        <UserIcon className="h-4 w-4" />
        <span>
          {getDisplayName(userObject)} {userObject.IsCurrentUser && "(You)"}
        </span>
      </div>
    </SelectItem>
  ));
};

export default UserDropdown;
