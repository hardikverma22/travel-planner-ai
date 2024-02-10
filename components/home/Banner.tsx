import GeneratePlanButton from "@/components/GeneratePlanButton";
import {Lightbulb} from "lucide-react";
import TravelHero from "@/components/home/TravelHero";

const Banner = () => {
  return (
    <section
      className="lg:px-20 px-5 py-2 
                ring-1
                w-full h-full
                flex lg:flex-row flex-col lg:justify-between justify-center items-center
                gap-5
                min-h-[calc(100vh-5.25rem)]"
    >
      <div className="flex flex-col h-full justify-start items-center lg:flex-1 ">
        <h1
          className="font-extrabold lg:text-7xl md:text-5xl text-4xl font-sans
      text-left w-full"
        >
          Uncover the <br /> <span className="text-blue-500">AI</span> Travel{" "}
          <span className="text-blue-500">Plan</span>
        </h1>

        <div className="mt-5 lg:mt-10 rounded-md w-full text-left">
          <div className="flex justify-start  items-center">
            <Lightbulb className="mr-1 text-yellow-600" />
            <span className="text-center">
              Imagine telling your travel planner,
            </span>
          </div>
          <div className="p-2">
            <p className="text-blue-500 font-bold tracking-normal">
              'Weekend escape to a vibrant city, <br className="lg:hidden" />
              with mid-range budget in summer.'
            </p>
            <p
              className="mt-5 mb-5 
                      text-sm
                    text-gray-600
                      md:max-w-xl 
                      text-left"
            >
              Our AI not only understands but crafts a personalized adventure.
              Discover local secrets, savor culinary delights, and explore
              iconic landmarks with an itinerary designed just for you.
            </p>
          </div>
        </div>
        <div className="w-full ml-2 flex justify-start">
          <GeneratePlanButton />
        </div>
      </div>
      <div className="h-full lg:flex-1 flex-1 overflow-hidden">
        <TravelHero />
      </div>
    </section>
  );
};

export default Banner;
