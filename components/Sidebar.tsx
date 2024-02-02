"use client";

import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {
  Backpack,
  Clock3,
  Info,
  Lightbulb,
  MapPin,
  Navigation,
  Sailboat,
  Utensils,
} from "lucide-react";
import Link from "next/link";

import {usePathname} from "next/navigation";
const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12 lg:col-span-1 col-span-full")}>
      <div className="space-y-4 py-4 sticky top-2">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="space-y-1">
            <Link href={`${pathname}#imagination`}>
              <Button variant="ghost" className="w-full justify-start">
                <Lightbulb className="mr-2 h-4 w-4" />
                Your Imagination
              </Button>
            </Link>
            <Link href={`${pathname}#abouttheplace`}>
              <Button variant="ghost" className="w-full justify-start">
                <Info className="mr-2 h-4 w-4" />
                About the Place
              </Button>
            </Link>

            <Link href={`${pathname}#topactivities`}>
              <Button variant="ghost" className="w-full justify-start">
                <Sailboat className="mr-2 h-4 w-4" />
                Top Activities
              </Button>
            </Link>
            <Link href={`${pathname}#topplacestovisit`}>
              <Button variant="ghost" className="w-full justify-start">
                <MapPin className="mr-2 h-4 w-4" />
                Top places to visit
              </Button>
            </Link>
            <Link href={`${pathname}#itinerary`}>
              <Button variant="ghost" className="w-full justify-start">
                <Navigation className="mr-2 h-4 w-4" />
                Itinerary
              </Button>
            </Link>
            <Link href={`${pathname}#localcuisines`}>
              <Button variant="ghost" className="w-full justify-start">
                <Utensils className="mr-2 h-4 w-4" />
                Local Cuisines
              </Button>
            </Link>
            <Link href={`${pathname}#packingchecklist`}>
              <Button variant="ghost" className="w-full justify-start">
                <Backpack className="mr-2 h-4 w-4" />
                Packing Checklist
              </Button>
            </Link>
            <Link href={`${pathname}#besttimetovisit`}>
              <Button variant="ghost" className="w-full justify-start">
                <Clock3 className="mr-2 h-4 w-4" />
                Best time to visit
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
