import {GiJourney} from "react-icons/gi";

export function NoPlans({isLoading}: {isLoading: boolean}) {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div
        className="flex flex-col justify-center items-center w-fit
                          bg-white"
      >
        <GiJourney className="text-9xl text-blue-500" />
        <p className="font-bold text-lg capitalize leading-10">
          {isLoading ? "Loading Travel Plans..." : "No plans created yet!"}
        </p>
      </div>
    </div>
  );
}
