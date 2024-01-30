import SectionWrapper from "@/components/sections/SectionWrapper";
import {Skeleton} from "@/components/ui/skeleton";
import {Info} from "lucide-react";
import Image from "next/image";

export default function AboutThePlace({
  content,
  imageUrl,
}: {
  content: string | undefined;
  imageUrl: string | null | undefined;
}) {
  return (
    <SectionWrapper id="abouttheplace">
      <h2 className="mb-2 text-lg font-semibold underline underline-offset-2 tracking-wide flex items-center">
        <Info className="mr-2" />
        About the Place
      </h2>
      <div className="ml-8">
        {content ? (
          <p className="tracking-wide font-medium text-slate-700">{content}</p>
        ) : (
          <Skeleton className="w-full h-full" />
        )}
        {imageUrl && (
          <div className="relative w-full h-[450px]">
            <Image
              src={imageUrl}
              alt="Image for the place"
              sizes="100vw"
              className="w-full rounded-md mt-3"
              fill
            />
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
