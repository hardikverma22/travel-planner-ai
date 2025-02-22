import { ACTIVITY_PREFERENCES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ActivityPreferences = ({
  values,
  onChange,
  className,
  activityClassName,
}: {
  values: string[];
  onChange: (values: string[]) => void;
  className?: string;
  activityClassName?: string;
}) => {
  return (
    <div className={cn("flex gap-2 flex-wrap", className)}>
      {ACTIVITY_PREFERENCES.map((activity) => (
        <label
          key={activity.id}
          className={cn(
            `flex-grow p-1 opacity-50 hover:opacity-100 dark:opacity-40 dark:hover:opacity-100 
      has-[:checked]:bg-blue-100 has-[:checked]:opacity-100 dark:has-[:checked]:opacity-100
      duration-200 transition-all ease-in-out
      rounded-md cursor-pointer select-none
      flex justify-start items-center w-fit
      bg-gray-100 has-[:checked]:shadow-sm dark:bg-transparent dark:border dark:border-foreground`,
            activityClassName
          )}
        >
          <input
            type="checkbox"
            className="hidden"
            checked={values.includes(activity.id)}
            onChange={(e) => {
              if (e.target.checked) {
                onChange([...values, activity.id]);
              } else {
                onChange(
                  values.filter(
                    (selectedActivity) => selectedActivity !== activity.id
                  )
                );
              }
            }}
          />
          <activity.icon className="w-5 h-5 pr-1" />
          <span>{activity.displayName}</span>
        </label>
      ))}
    </div>
  );
};

export default ActivityPreferences;
