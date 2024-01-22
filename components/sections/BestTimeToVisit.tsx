import SectionWrapper from "@/components/sections/SectionWrapper";
import {Skeleton} from "@/components/ui/skeleton";
import {Clock3} from "lucide-react";

export default function BestTimeToVisit({
  content,
}: {
  content: string | undefined;
}) {
  return (
    <SectionWrapper id="besttimetovisit">
      <h2 className="mb-2 text-lg font-semibold underline underline-offset-2 tracking-wide flex items-center">
        <Clock3 className="mr-2" /> Best time to visit
      </h2>
      {content ? <p>{content}</p> : <Skeleton className="w-full h-full" />}
    </SectionWrapper>
  );
}
