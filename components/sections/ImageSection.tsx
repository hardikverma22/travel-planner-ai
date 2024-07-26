"use client";

import PlanMetaData from "@/components/sections/PlanMetaData";
import {TooltipContainer} from "@/components/shared/Toolip";
import {Info} from "lucide-react";
import Image from "next/image";

type ImageSectionProps = {
  userPrompt: string | undefined;
  imageUrl: string | null | undefined;
  placeName: string | undefined;
  isLoading: boolean;
  allowEdit: boolean;
  companion: string | undefined;
  activityPreferences: string[];
  fromDate: number | undefined;
  toDate: number | undefined;
  planId: string;
};

const ImageSection = ({
  userPrompt,
  imageUrl,
  placeName,
  isLoading,
  allowEdit,
  companion,
  activityPreferences,
  fromDate,
  toDate,
  planId,
}: ImageSectionProps) => {
  return (
    <article
      id="imagination"
      className="
                flex flex-col gap-1 scroll-mt-20"
    >
      {isLoading ? (
        <div
          className="bg-gradient-to-r from-blue-200 to-cyan-200 h-[200px] 
                        md:h-[400px] flex items-end gap-5
                        shadow-md ring-1 ring-muted rounded-sm"
        >
          <div className="px-5 py-2 z-10 relative flex justify-between w-full bg-transparent text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <h2 className="text-2xl font-bold tracking-wide">{placeName}</h2>
            <div className="rounded-md w-fit">{userPrompt}</div>
          </div>
        </div>
      ) : (
        imageUrl && (
          <>
            <div className="relative w-full overflow-hidden h-[300px] md:h-[400px] flex items-end">
              <Image
                src={imageUrl}
                alt="Image for the place"
                sizes="100vw"
                className="w-full rounded-t-md object-cover z-0"
                fill
                priority={true}
              />
              <div className="px-5 py-2 z-10 relative flex justify-between w-full bg-black/40">
                <h2 className="text-2xl text-white font-bold tracking-wide text-balance text-left">
                  {placeName}
                </h2>
                <div className="rounded-md w-fit ml-8">
                  <p className="text-white text-balance  text-right">"{userPrompt}"</p>
                </div>
              </div>
              <div className="absolute top-3 right-3 flex flex-col gap-1 justify-end">
                {!allowEdit && (
                  <div className="bg-foreground rounded-full">
                    <TooltipContainer text="This is a community shared travel plans.">
                      <Info className="text-background cursor-pointer" />
                    </TooltipContainer>
                  </div>
                )}
                <PlanMetaData
                  allowEdit={allowEdit}
                  companion={companion}
                  activityPreferences={activityPreferences}
                  fromDate={fromDate}
                  toDate={toDate}
                  planId={planId}
                />
              </div>
            </div>
          </>
        )
      )}
    </article>
  );
};

export default ImageSection;
