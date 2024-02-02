import SectionWrapper from "@/components/sections/SectionWrapper";
import {Skeleton} from "@/components/ui/skeleton";
import {Backpack} from "lucide-react";

export default function PackingChecklist({
  checklist,
}: {
  checklist: string[] | undefined;
}) {
  return (
    <SectionWrapper id="packingchecklist">
      <h2 className="mb-2 text-lg font-semibold underline underline-offset-2 tracking-wide flex items-center">
        <Backpack className="mr-2" /> Packing Checklist
      </h2>
      {checklist && checklist?.length > 0 ? (
        <div className="ml-8">
          <ol className="max-w-xl space-y-1 text-gray-500 list-decimal list-inside dark:text-gray-400">
            {checklist.map((item) => (
              <li key={item}>
                <span className="font-normal text-gray-900 dark:text-white">
                  {item}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <Skeleton className="w-full h-full" />
      )}
    </SectionWrapper>
  );
}
