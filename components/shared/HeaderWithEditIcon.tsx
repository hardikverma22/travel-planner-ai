import {Button} from "@/components/ui/button";
import {PencilIcon, PlusIcon} from "lucide-react";
import {ReactNode} from "react";

type Props = {
  icon: ReactNode;
  shouldShowEditIcon: boolean;
  handleToggleEditMode: () => void;
  title: string;
  hasData: boolean;
  isLoading?: boolean;
};

const HeaderWithEditIcon = ({
  icon,
  shouldShowEditIcon,
  handleToggleEditMode,
  title,
  hasData,
  isLoading = false,
}: Props) => {
  return (
    <div className="mb-2 flex justify-between items-center">
      <h2
        className="text-lg font-semibold 
                tracking-wide flex items-center"
      >
        {icon} {title}
      </h2>
      {shouldShowEditIcon && !isLoading && (
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={handleToggleEditMode}
        >
          {!hasData ? <PlusIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
};

export default HeaderWithEditIcon;
