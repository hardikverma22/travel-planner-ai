import {TooltipContainer} from "@/components/shared/Toolip";
import {Info} from "lucide-react";
import Image from "next/image";

type PromptProps = {
  content: string | undefined;
  imageUrl: string | null | undefined;
  placeName: string | undefined;
  isLoading: boolean;
  allowEdit: boolean;
};

const ImageSection = ({content, imageUrl, placeName, isLoading, allowEdit}: PromptProps) => {
  return (
    <article
      id="imagination"
      className="shadow-md ring-1 ring-muted bg-white/50 rounded-sm 
                flex flex-col gap-5 scroll-mt-20"
    >
      {isLoading ? (
        <div
          className="bg-gradient-to-r from-blue-200 to-cyan-200 h-[200px] 
                        md:h-[400px] flex items-end gap-5"
        >
          <div className="px-5 py-2 z-10 relative flex justify-between w-full bg-transparent text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <h2 className="text-2xl font-bold tracking-wide">{placeName}</h2>
            <div className="rounded-md w-fit">{content}</div>
          </div>
        </div>
      ) : (
        imageUrl && (
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
              <h2 className="text-2xl text-white font-bold tracking-wide">{placeName}</h2>
              <div className="rounded-md w-fit ml-8">
                <p className="text-white">"{content}"</p>
              </div>
            </div>
            {!allowEdit && (
              <div className="absolute top-3 right-3 bg-foreground rounded-full">
                <TooltipContainer text="This is a community shared travel plans.">
                  <Info className="text-background cursor-pointer" />
                </TooltipContainer>
              </div>
            )}
          </div>
        )
      )}
    </article>
  );
};

export default ImageSection;
