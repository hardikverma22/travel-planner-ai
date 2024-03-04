import {Button} from "@/components/ui/button";
import {PencilIcon, PlusIcon} from "lucide-react";
import {ReactNode} from "react";

type Props = {
  icon: ReactNode;
  editMode: boolean;
  handleToggleEditMode: () => void;
  title: string;
  hasData: boolean;
};

const HeaderWithEditIcon = ({icon, editMode, handleToggleEditMode, title, hasData}: Props) => {
  return (
    <div className="mb-2 flex justify-between items-center">
      <h2
        className="text-lg font-semibold underline underline-offset-2
                tracking-wide flex items-center"
      >
        {icon} {title}
      </h2>
      {!editMode && (
        <Button variant="outline" size="icon" onClick={handleToggleEditMode}>
          {!hasData ? <PlusIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
};

export default HeaderWithEditIcon;
