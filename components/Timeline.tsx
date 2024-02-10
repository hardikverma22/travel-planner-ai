import {Doc} from "@/convex/_generated/dataModel";
import {Sun, Sunrise, Sunset} from "lucide-react";
import {ReactNode} from "react";

type TimelineProps = {
  itinerary: Doc<"plan">["itinerary"] | undefined;
};

const Timeline = ({itinerary}: TimelineProps) => {
  const filteredItinerary = itinerary?.filter((day) => {
    const isMorningEmpty = day.activities.morning.length === 0;
    const isAfternoonEmpty = day.activities.afternoon.length === 0;
    const isEveningEmpty = day.activities.evening.length === 0;

    return !(isMorningEmpty && isAfternoonEmpty && isEveningEmpty);
  });

  return (
    <ol className="relative border-s border-gray-200 ml-10 mt-5">
      {filteredItinerary?.map((day) => (
        <li className="mb-10 ms-6" key={day.title}>
          <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
            <svg
              className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
            </svg>
          </span>
          <div className="mb-2 text-lg font-bold leading-2 text-gray-900 ">
            {day.title}
          </div>

          <div className="flex flex-col gap-5">
            <Activity
              activity={day.activities.morning}
              heading="Morning"
              icon={<Sunrise className="w-4 h-4 text-blue-500" />}
            />
            <Activity
              activity={day.activities.afternoon}
              heading="Afternoon"
              icon={<Sun className="w-4 h-4 text-yellow-500" />}
            />
            <Activity
              activity={day.activities.evening}
              heading="Evening"
              icon={<Sunset className="w-4 h-4 text-gray-600" />}
            />
          </div>
        </li>
      ))}
    </ol>
  );
};

const Activity = ({
  activity,
  heading,
  icon,
}: {
  activity: {itineraryItem: string; briefDescription: string}[];
  heading: string;
  icon: ReactNode;
}) => {
  if (activity.length == 0) return null;
  return (
    <div className="flex flex-col gap-2 shadow-md p-2 bg-slate-50">
      <h3
        className="text-sm leading-none
                  text-gray-600  w-max p-2 font-semibold
                  flex justify-center gap-2 items-center capitalize"
      >
        {icon}
        {heading}
      </h3>
      <ul className="space-y-1 text-gray-500 pl-2">
        {activity.map((act, index) => (
          <li key={index}>
            <div className="w-full p-1 overflow-hidden">
              <span className=" text-black font-semibold">
                {act.itineraryItem}
              </span>
              <p className="max-w-md md:max-w-full text-wrap whitespace-pre-line">
                {act.briefDescription}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timeline;
