import React from "react";
import GeneratePlanButton from "@/components/GeneratePlanButton";
import {Button} from "@/components/ui/button";
import {Lightbulb} from "lucide-react";
import TravelHero from "@/components/TravelHero";

const Hero = () => {
  return (
    <div
      className="lg:px-20 px-5 py-2 
                    ring-1
                    w-full h-full
                    flex lg:justify-between flex-col lg:flex-row justify-center items-center
                    gap-5
                    min-h-[calc(100vh-5.25rem)]"
    >
      <div className="flex flex-col h-full justify-start items-center lg:flex-1 ">
        <h1
          className="font-extrabold lg:text-7xl md:text-5xl text-4xl font-sans
                        lg:text-left text-center w-full"
        >
          Uncover the <br /> <span className="text-blue-500">AI</span> Travel{" "}
          <span className="text-blue-500">Plan</span>
        </h1>

        <div className="mt-5 lg:mt-10 rounded-md w-full lg:text-left text-center">
          <div className="flex lg:justify-start justify-center items-center">
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
            <p className="text-sm text-gray-600 max-w-xl mt-5 mb-5 lg:text-left text-center">
              Our AI not only understands but crafts a personalized adventure.
              Discover local secrets, savor culinary delights, and explore
              iconic landmarks with an itinerary designed just for you.
            </p>
          </div>
        </div>
        <div className="w-full ml-2 flex justify-center lg:justify-start">
          <GeneratePlanButton />
        </div>
      </div>
      <div className="h-full lg:flex-1 flex-1 overflow-hidden">
        <TravelHero />
      </div>
    </div>
  );
};

export default Hero;
