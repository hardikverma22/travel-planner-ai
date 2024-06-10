"use client";

import Link from "next/link";
import {AuthLoading, Authenticated, Unauthenticated} from "convex/react";
import {SignInButton, UserButton} from "@clerk/nextjs";

import {Loading} from "@/components/shared/Loading";
import MobileMenu from "@/components/MobileMenu";
import DrawerWithDialog from "@/components/shared/DrawerWithDialog";
import PlanComboBox from "@/components/plan/PlanComboBox";
import {navlinks} from "@/lib/constants";
import {cn} from "@/lib/utils";
import useAuth from "@/hooks/useAuth";
import {MapPinIcon} from "lucide-react";
import {ThemeDropdown} from "@/components/ThemeDropdown";
import FeedbackSheet from "@/components/common/FeedbackSheet";

const Header = () => {
  const {isCurrentPathDashboard, isCurrentPathHome, isAuthenticated} = useAuth();

  return (
    <header
      className={cn(
        "w-full border-b bottom-2 border-border/40 z-50 sticky top-0",
        "bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isCurrentPathHome && "sticky top-0"
      )}
    >
      <nav className="lg:px-20 px-5 py-3 mx-auto">
        <div className="flex justify-evenly w-full">
          <div className="hidden md:flex gap-10 items-center justify-start flex-1">
            <Link href={isAuthenticated ? "/dashboard" : "/"}>
              <div className="flex gap-1 justify-center items-center">
                <MapPinIcon className="h-10 w-10 text-blue-500" />
                <div className="flex flex-col leading-5 font-bold text-xl">
                  <span>Travel</span>
                  <span>
                    Planner
                    <span className="text-blue-500 ml-0.5">AI</span>
                  </span>
                </div>
              </div>
            </Link>
          </div>
          <div className="hidden md:flex items-center flex-1 justify-center">
            <ul className="flex gap-8 items-center text-sm">
              {isCurrentPathHome && (
                <>
                  {navlinks.map((link) => (
                    <li key={link.id} className="hover:underline cursor-pointer">
                      <Link href={`/#${link.id}`}>{link.text}</Link>
                    </li>
                  ))}
                  <li className="hover:underline cursor-pointer">
                    <Link href="dashboard" scroll>
                      Dashboard
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div className="md:hidden flex gap-6 flex-1">
            <MobileMenu
              isCurrentPathHome={isCurrentPathHome}
              isCurrentPathDashboard={isCurrentPathDashboard}
              isAuthenticated={isAuthenticated}
            />
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
                {!isCurrentPathDashboard && !isCurrentPathHome && <PlanComboBox />}
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
