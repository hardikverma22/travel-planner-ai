"use client";

import SectionWrapper from "@/components/sections/SectionWrapper";
import EditList from "@/components/shared/EditList";
import HeaderWithEditIcon from "@/components/shared/HeaderWithEditIcon";
import List from "@/components/shared/List";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {api} from "@/convex/_generated/api";
import {Doc} from "@/convex/_generated/dataModel";
import {useMutation} from "convex/react";
import {PencilIcon, PlusIcon, Sailboat} from "lucide-react";
import {useState} from "react";

type TopActivitiesProps = {
  activities: string[] | undefined;
  planId: string;
  isLoading: boolean;
  allowEdit: boolean;
};

export default function TopActivities({
  activities,
  planId,
  isLoading,
  allowEdit,
}: TopActivitiesProps) {
  const [editMode, setEditMode] = useState(false);
  const updateActivities = useMutation(api.plan.updatePartOfPlan);

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
  };

  const updateActivitiesToDo = (updatedArray: string[]) => {
    updateActivities({
      planId: planId as Doc<"plan">["_id"],
      data: updatedArray,
      key: "adventuresactivitiestodo",
    }).then(() => {
      handleToggleEditMode();
    });
  };

  return (
    <SectionWrapper id="adventuresactivitiestodo">
      <HeaderWithEditIcon
        shouldShowEditIcon={!editMode && allowEdit}
        handleToggleEditMode={handleToggleEditMode}
        hasData={activities != null && activities.length != 0}
        icon={<Sailboat className="mr-2" />}
        title="Top activities to look for"
        isLoading={isLoading}
      />
      {!isLoading && activities ? (
        <div className="ml-8">
          {editMode ? (
            <EditList
              arrayData={activities}
              handleToggleEditMode={handleToggleEditMode}
              updateData={updateActivitiesToDo}
            />
          ) : (
            <List list={activities} />
          )}
        </div>
      ) : (
        <Skeleton className="w-full h-full" />
      )}
    </SectionWrapper>
  );
}
