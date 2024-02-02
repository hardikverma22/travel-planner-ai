import {Doc} from "@/convex/_generated/dataModel";
import navigationSvg from "@/public/card-navigation.svg";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {MapPin} from "lucide-react";

type PlanCardProps = {
  plan: Doc<"plan"> & {url: string | null};
};

const PlanCard = ({plan}: PlanCardProps) => {
  return (
    <Link
      href={`/plans/${plan._id}`}
      className="flex justify-center items-center shadow-lg"
    >
      <Card
        className="w-64 md:w-72 flex-1
                       h-[250px] rounded-lg cursor-pointer overflow-hidden group/card hover:shadow-md"
      >
        <CardContent className="w-full flex flex-col gap-4 h-full overflow-hidden">
          <div className="relative h-1/2 w-full">
            <Image
              alt="travelpic"
              src={plan.url ?? navigationSvg}
              fill={true}
              className="relative -z-1 object-cover rounded-t-lg w-full group-hover/card:scale-105 transition ease-in-out duration-500"
              priority={true}
            />
          </div>

          <div className="p-2 pt-0 flex-1 flex justify-between flex-col">
            <CardDescription>
              {new Date(plan._creationTime).toLocaleDateString("en-us", {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </CardDescription>
            <div>
              <div
                className="rounded-lg
                            flex justify-start items-center gap-1"
              >
                <MapPin className="h-4 w-4 -ml-1" />
                {plan.nameoftheplace}
              </div>
              <CardTitle className="line-clamp-1 text-md">
                {plan.userPrompt}
              </CardTitle>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PlanCard;
