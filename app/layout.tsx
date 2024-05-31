import type {Metadata} from "next";
import {Montserrat_Alternates} from "next/font/google";
import {Analytics} from "@vercel/analytics/react";

import Header from "@/components/Header";

import ConvexClientProvider from "./ConvexClientProvider";

const inter = Montserrat_Alternates({weight: "500", subsets: ["cyrillic"]});
import Progress from "@/components/Progress";
import {Toaster} from "@/components/ui/toaster";

import "./globals.css";
import {ThemeProvider} from "@/contexts/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.travelplannerai.online"),
  title: {
    default: "Travel Planner AI - Your Smart Travel Planner",
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

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            <Header />
            <main className="flex min-h-[calc(100svh-4rem)] flex-col items-center bg-blue-50/40">
              {children}
              <Progress />
              <Analytics />
              <Toaster />
            </main>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
