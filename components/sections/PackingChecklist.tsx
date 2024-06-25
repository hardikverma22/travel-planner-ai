"use client";
import SectionWrapper from "@/components/sections/SectionWrapper";
import EditList from "@/components/shared/EditList";
import HeaderWithEditIcon from "@/components/shared/HeaderWithEditIcon";
import List from "@/components/shared/List";
import {Skeleton} from "@/components/ui/skeleton";
import {api} from "@/convex/_generated/api";
import {Doc} from "@/convex/_generated/dataModel";
import {useMutation} from "convex/react";
import {Backpack} from "lucide-react";
import {useState} from "react";

type PackingChecklistProps = {
  checklist: string[] | undefined;
  planId: string;
  isLoading: boolean;
  allowEdit: boolean;
};

export default function PackingChecklist({
  checklist,
  isLoading,
  planId,
  allowEdit,
}: PackingChecklistProps) {
  const [editMode, setEditMode] = useState(false);
  const updatePackingChecklist = useMutation(api.plan.updatePartOfPlan);

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
  };

  const updateChecklist = (updatedArray: string[]) => {
    updatePackingChecklist({
      planId: planId as Doc<"plan">["_id"],
      data: updatedArray,
      key: "packingchecklist",
    }).then(() => {
      handleToggleEditMode();
    });
  };

  return (
    <SectionWrapper id="packingchecklist">
      <HeaderWithEditIcon
        shouldShowEditIcon={!editMode && allowEdit}
        handleToggleEditMode={handleToggleEditMode}
        hasData={checklist != null && checklist.length != 0}
        icon={<Backpack className="mr-2" />}
        title="Packing Checklist"
        isLoading={isLoading}
      />

      {!isLoading && checklist ? (
        <div className="ml-8">
          {editMode ? (
            <EditList
              arrayData={checklist}
              handleToggleEditMode={handleToggleEditMode}
              updateData={updateChecklist}
            />
          ) : (
            <List list={checklist} />
          )}
        </div>
      ) : (
        <Skeleton className="w-full h-full" />
      )}
    </SectionWrapper>
  );
}
