import {Doc} from "@/convex/_generated/dataModel";
import navigationSvg from "@/public/card-navigation.svg";
import {Card, CardContent, CardDescription, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {CalendarDaysIcon, MapPin, PlaneIcon} from "lucide-react";
import {TooltipContainer} from "@/components/shared/Toolip";
import {getFormattedDateRange} from "@/lib/utils";

type PlanCardProps = {
  plan: Doc<"plan"> & {url: string | null} & {isSharedPlan: boolean} & Pick<
      Doc<"planSettings">,
      "fromDate" | "toDate"
    >;
  isPublic?: boolean;
};

const PlanCard = ({plan, isPublic = false}: PlanCardProps) => {
  return (
    <Link
      role="article"
      href={isPublic ? `/plans/${plan._id}/community-plan` : `/plans/${plan._id}/plan`}
      className="flex justify-center items-center shadow-lg"
    >
      <Card
        className="w-64 md:w-72 flex-1
                       h-[250px] rounded-lg cursor-pointer overflow-hidden group/card hover:shadow-md"
      >
        <CardContent className="w-full flex flex-col gap-4 h-full overflow-hidden">
          <div className="relative h-full w-full">
            <Image
              role="figure"
              alt="travelpic"
              src={plan.url ?? navigationSvg}
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="relative -z-1 object-cover rounded-t-lg w-full group-hover/card:scale-105 transition ease-in-out duration-500"
              priority={false}
            />
            {plan.isSharedPlan && (
              <TooltipContainer text="This plan had been shared to you">
                <div className="absolute right-1 top-1 bg-white rounded-lg p-1 text-sm shadow-lg text-gray-600">
                  Shared
                </div>
              </TooltipContainer>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{plan.nameoftheplace}</h3>
                  {!isPublic && (
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDaysIcon className="h-4 w-4" />
                      <span>
                        {plan.fromDate && plan.toDate
                          ? getFormattedDateRange(
                              new Date(plan.fromDate),
                              new Date(plan.toDate),
                              "PP"
                            )
                          : "Select Dates from plan Page"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PlanCard;
