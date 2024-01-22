"use client";

import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {cn} from "@/lib/utils";
import {
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
              <Button variant="secondary" className="w-full justify-start">
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
            <Link href={`${pathname}#itinerary`}>
              <Button variant="ghost" className="w-full justify-start">
                <Utensils className="mr-2 h-4 w-4" />
                Foodie Places
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
        {/* <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Library
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M21 15V6" />
                <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                <path d="M12 12H3" />
                <path d="M16 6H3" />
                <path d="M12 18H3" />
              </svg>
              Playlists
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <circle cx="8" cy="18" r="4" />
                <path d="M12 18V2l7 4" />
              </svg>
              Songs
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Made for You
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" />
                <circle cx="17" cy="7" r="5" />
              </svg>
              Artists
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="m16 6 4 14" />
                <path d="M12 6v14" />
                <path d="M8 8v12" />
                <path d="M4 4v16" />
              </svg>
              Albums
            </Button>
          </div>
        </div>
        <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight">
            Playlists
          </h2>
          <ScrollArea className="h-[300px] px-1">
            <div className="space-y-1 p-2">
              {playlists?.map((playlist, i) => (
                <Button
                  key={`${playlist}-${i}`}
                  variant="ghost"
                  className="w-full justify-start font-normal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M21 15V6" />
                    <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                    <path d="M12 12H3" />
                    <path d="M16 6H3" />
                    <path d="M12 18H3" />
                  </svg>
                  {playlist}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div> */}
      </div>
    </div>
  );
};

export default Sidebar;
