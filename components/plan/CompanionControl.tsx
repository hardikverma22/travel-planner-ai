import { COMPANION_PREFERENCES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const CompanionControl = ({
  value,
  onChange,
  className,
}: {
  value: string | undefined;
  onChange: (companionId: string) => void;
  className?: string;
}) => {
  return (
    <div className={cn("flex gap-2 flex-wrap", className)}>
      {COMPANION_PREFERENCES.map((companion) => (
        <label
          key={companion.id}
          className="flex-1 p-1 opacity-50 hover:opacity-100 dark:opacity-40 dark:hover:opacity-100 
                  has-[:checked]:bg-blue-100 has-[:checked]:opacity-100 dark:has-[:checked]:opacity-100
                  duration-200 transition-all ease-in-out
                  rounded-md cursor-pointer select-none
                  flex justify-center items-center
                  bg-gray-100 has-[:checked]:shadow-sm dark:bg-transparent dark:border dark:border-foreground
                  "
        >
          <input
            type="radio"
            className="hidden"
            name="companion"
            checked={value == companion.id}
            onChange={(e) => {
              if (e.target.checked) {
                onChange(companion.id);
              }
            }}
          />
          <companion.icon className="w-5 h-5 pr-1" />
          <span>{companion.displayName}</span>
        </label>
      ))}
    </div>
  );
};

export default CompanionControl;
