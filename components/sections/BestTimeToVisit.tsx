import SectionWrapper from "@/components/sections/SectionWrapper";
import {Skeleton} from "@/components/ui/skeleton";
import {Clock3} from "lucide-react";

type BestTimeToVisitProps = {
  content: string | undefined;
};

export default function BestTimeToVisit({content}: BestTimeToVisitProps) {
  return (
    <SectionWrapper id="besttimetovisit">
      <h2 className="mb-2 text-lg font-semibold underline underline-offset-2 tracking-wide flex items-center">
        <Clock3 className="mr-2" /> Best time to visit
      </h2>
      {content ? <p className="ml-8">{content}</p> : <Skeleton className="w-full h-full" />}
    </SectionWrapper>
  );
}
