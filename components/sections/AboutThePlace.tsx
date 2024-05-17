import SectionWrapper from "@/components/sections/SectionWrapper";
import {Skeleton} from "@/components/ui/skeleton";
import {Info} from "lucide-react";

type AboutThePlaceProps = {
  content: string | undefined;
};

export default function AboutThePlace({content}: AboutThePlaceProps) {
  return (
    <SectionWrapper id="abouttheplace">
      <h2 className="mb-2 text-lg font-semibold underline underline-offset-2 tracking-wide flex items-center">
        <Info className="mr-2" />
        About the Place
      </h2>
      <div className="ml-8">
        {content ? (
          <p className="tracking-wide font-medium text-accent-foreground/90">{content}</p>
        ) : (
          <Skeleton className="w-full h-full" />
        )}
      </div>
    </SectionWrapper>
  );
}
