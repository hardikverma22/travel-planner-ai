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
  title: "Travel Planner AI",
  description:
    "A smart travel planner for smart travel suggestions, and real-time destination insights.",
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
