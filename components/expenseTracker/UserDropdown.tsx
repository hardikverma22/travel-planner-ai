import {SelectItem} from "@/components/ui/select";
import {UserIcon} from "lucide-react";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

const UserDropdown = ({planId, userId}: {planId: string; userId: string}) => {
  let validUserList = [{userId: userId, email: "Myself"}];
  const sharedUserList = useQuery(api.plan.getAllUsersForAPlan, {
    planId: planId as Id<"plan">,
  });

  validUserList = sharedUserList ?? validUserList;

  return validUserList.map((user) => (
    <SelectItem value={user.userId} key={user.userId}>
      <div className="flex gap-2 items-center">
        <UserIcon className="h-4 w-4" />
        <span>{user.email}</span>
      </div>
    </SelectItem>
  ));
};

export default UserDropdown;
