"use client";

import Link from "next/link";
import {AuthLoading, Authenticated, Unauthenticated} from "convex/react";
import {SignInButton, UserButton} from "@clerk/nextjs";

import {Loading} from "@/components/Shared/Laoding";
import MobileMenu from "@/components/MobileMenu";
import Credits from "@/components/Shared/DrawerDialog";
import PlanComboBox from "@/components/plan/PlanComboBox";
import {navlinks} from "@/lib/constants";
import {cn} from "@/lib/utils";
import useAuth from "@/hooks/useAuth";

const Header = () => {
  const {isCurrentPathDashboard, isCurrentPathHome, isAuthenticated} = useAuth();

  return (
    <header
      className={cn(
        "w-full border-b bottom-2 border-gray-200 z-50 bg-white/90",
        isCurrentPathHome && "sticky top-0"
      )}
    >
      <nav className="lg:px-20 px-5 py-3 mx-auto">
        <div className="flex justify-between ">
          <div className="hidden md:flex gap-10 items-center">
            <Link href={isAuthenticated ? "/dashboard" : "/"}>
              <div className="flex flex-col leading-5 font-bold text-xl">
                <span>Travel</span>
                <span>
                  Planner
                  <span className="text-blue-500 ml-0.5">AI</span>
                </span>
              </div>
            </Link>
            <ul className="flex gap-8 items-center text-sm">
              {isCurrentPathHome && (
                <>
                  {navlinks.map((link) => (
                    <li key={link.id} className="hover:underline cursor-pointer">
                      <Link href={`/#${link.id}`} scroll>
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>
          <div className="md:hidden flex gap-6">
            <MobileMenu
              isCurrentPathHome={isCurrentPathHome}
              isCurrentPathDashboard={isCurrentPathDashboard}
            />
          </div>
          <div className="flex gap-4 justify-center items-center">
            <AuthLoading>
              <Loading />
            </AuthLoading>
            <Unauthenticated>
              <SignInButton mode="modal" afterSignInUrl="/dashboard" />
            </Unauthenticated>
            <Authenticated>
              <div className="flex justify-center items-center gap-2">
                {!isCurrentPathDashboard && !isCurrentPathHome && <PlanComboBox />}
                <Credits />
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
