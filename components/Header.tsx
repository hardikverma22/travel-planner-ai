"use client";

import Link from "next/link";

import {Loading} from "@/components/Laoding";
import MobileMenu from "@/components/MobileMenu";

import {navlinks} from "@/lib/constants";

import {SignInButton, UserButton} from "@clerk/nextjs";

import {AuthLoading, Authenticated, Unauthenticated} from "convex/react";
import useAuth from "@/hooks/useAuth";
import Credits from "@/components/DrawerDialog";
import {cn} from "@/lib/utils";

const Header = () => {
  const {isCurrentPathDashboard, isCurrentPathHome} = useAuth();

  return (
    <header
      className={cn(
        "w-full border-b bottom-2 border-gray-200 z-50 bg-white/90",
        isCurrentPathHome && "sticky top-0"
      )}
    >
      <nav className="lg:px-20 px-5 py-5 mx-auto">
        <div className="flex justify-between ">
          <div className="hidden md:flex gap-10 items-center">
            <Link href="/">
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
                    <li
                      key={link.id}
                      className="hover:underline cursor-pointer"
                    >
                      <Link href={`/#${link.id}`} scroll>
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </>
              )}
              <Authenticated>
                {!isCurrentPathDashboard && (
                  <li className="hover:underline cursor-pointer">
                    <Link href="/dashboard">Dashboard</Link>
                  </li>
                )}
              </Authenticated>
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
              <Credits />
              <UserButton afterSignOutUrl="/" />
            </Authenticated>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
