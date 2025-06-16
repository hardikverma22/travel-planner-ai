"use client";

import { AuthLoading, Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";

import { Loading } from "@/components/shared/Loading";
import { cn } from "@/lib/utils";
import { ThemeDropdown } from "@/components/ThemeDropdown";
import FeedbackSheet from "@/components/common/FeedbackSheet";
import Logo from "@/components/common/Logo";
import MenuItems from "@/components/home/MenuItems";
import MobileMenu from "@/components/home/MobileMenu";
import { CreditsDrawerWithDialog } from "@/components/shared/DrawerWithDialogGeneric";
import Link from "next/link";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

const Header = () => {
  return (
    <header
      className={cn(
        "w-full border-b bottom-2 border-border/40 z-50 sticky top-0",
        "bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <nav className="lg:px-20 px-5 py-3 mx-auto">
        <div className="flex justify-evenly w-full">
          <Logo />
          {/* <div className="hidden md:flex items-center justify-center">
            <ul className="flex gap-8 items-center text-sm">
              <MenuItems />
            </ul>
          </div> */}
          <div className="md:hidden flex gap-6 flex-1">
            <MobileMenu />
          </div>
          <div className="flex gap-4 justify-end items-center flex-1">
            <Link href="https://rutugo.com" className="hidden md:block">
              <InteractiveHoverButton className="border-2 border-gray-200">
                Rutugo
              </InteractiveHoverButton>
            </Link>


          </div>
        </div>
      </nav>
    </header >
  );
};

export default Header;
