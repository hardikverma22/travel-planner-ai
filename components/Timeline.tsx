import {Doc} from "@/convex/_generated/dataModel";

const Timeline = ({
  itinerary,
}: {
  itinerary: Doc<"plan">["itinerary"] | undefined;
}) => {
  const filteredItinerary = itinerary?.filter((day) => {
    const isMorningEmpty = day.activities.morning.length === 0;
    const isAfternoonEmpty = day.activities.afternoon.length === 0;
    const isEveningEmpty = day.activities.evening.length === 0;

    return !(isMorningEmpty && isAfternoonEmpty && isEveningEmpty);
  });

  return (
    <ol className="relative border-s border-gray-200 dark:border-gray-700">
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
            <Activity activity={day.activities.morning} heading="Morning" />
            <Activity activity={day.activities.afternoon} heading="Afternoon" />
            <Activity activity={day.activities.evening} heading="Evening" />
          </div>
        </li>
      ))}
    </ol>
  );
};

const Activity = ({
  activity,
  heading,
}: {
  activity: string[];
  heading: string;
}) => {
  if (activity.length == 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-normal leading-none text-gray-600">
        {heading}
      </h3>
      <ul className="max-w-xl space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
        {activity.map((act, index) => (
          <li key={index}>
            <span className="font-normal text-gray-900 dark:text-white">
              {act}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timeline;
