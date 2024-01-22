import SectionWrapper from "@/components/sections/SectionWrapper";
import {Skeleton} from "@/components/ui/skeleton";
import {Info} from "lucide-react";

export default function AboutThePlace({
  content,
}: {
  content: string | undefined;
}) {
  return (
    <SectionWrapper id="abouttheplace">
      <h2 className="mb-2 text-lg font-semibold underline underline-offset-2 tracking-wide flex items-center">
        <Info className="mr-2" />
        About the Place
      </h2>
      {content ? <p>{content}</p> : <Skeleton className="w-full h-full" />}
    </SectionWrapper>
  );
}
