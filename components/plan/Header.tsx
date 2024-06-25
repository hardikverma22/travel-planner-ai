"use client";

import {AuthLoading, Authenticated, Unauthenticated} from "convex/react";
import {SignInButton, UserButton} from "@clerk/nextjs";

import {Loading} from "@/components/shared/Loading";
import DrawerWithDialog from "@/components/shared/DrawerWithDialog";
import PlanComboBox from "@/components/plan/PlanComboBox";
import {cn} from "@/lib/utils";
import {ThemeDropdown} from "@/components/ThemeDropdown";
import FeedbackSheet from "@/components/common/FeedbackSheet";
import Logo from "@/components/common/Logo";
import MobileMenu from "@/components/plan/MobileMenu";

const Header = ({isPublic}: {isPublic: boolean}) => {
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

          <div className="md:hidden flex gap-6 flex-1">
            <MobileMenu isPublic={isPublic}/>
          </div>
          <div className="flex gap-4 justify-end items-center flex-1">
            <AuthLoading>
              <Loading />
            </AuthLoading>
            <Unauthenticated>
              <ThemeDropdown />
              <SignInButton mode="modal" afterSignInUrl="/dashboard" />
            </Unauthenticated>
            <Authenticated>
              <div className="flex justify-center items-center gap-2">
                <PlanComboBox />
                <DrawerWithDialog />
                <FeedbackSheet />
                <ThemeDropdown />
                <UserButton afterSignOutUrl="/" />
              </div>
            </Authenticated>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
