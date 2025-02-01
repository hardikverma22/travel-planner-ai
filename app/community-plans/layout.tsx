import Header from "@/app/community-plans/Header";
import Progress from "@/components/Progress";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.travelplannerai.online"),
  title: {
    default: "Community Plans",
    template: "%s | Travel Planner AI - Your Smart Travel Planner",
  },
  description:
    "Travel Planner AI provides intelligent travel suggestions, personalized itineraries, and seamless trip planning. Plan your perfect trip with ease.",
  keywords:
    "travel planner, AI travel planner, smart travel, travel suggestions, destination insights, personalized itineraries, trip planning, travel tips, vacation planning",
  openGraph: {
    title: "Travel Planner AI - Your Smart Travel Planner",
    description:
      "Travel Planner AI provides intelligent travel suggestions, personalized itineraries, and seamless trip planning. Plan your perfect trip with ease.",
    url: "https://www.travelplannerai.online",
    type: "website",
    siteName: "TravelPlannerAI",
    images: [
      {
        url: "opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Travel Planner AI",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex min-h-[calc(100svh-4rem)] flex-col items-center relative lg:px-20 px-5 mx-auto">
        {children}
      </main>
      <Progress />
    </>
  );
}
