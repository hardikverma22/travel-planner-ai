"use client";

import Link from "next/link";

import {Loading} from "@/components/Laoding";
import MobileMenu from "@/components/MobileMenu";

import {navlinks} from "@/lib/constants";

import {SignInButton, UserButton} from "@clerk/nextjs";

import {AuthLoading, Authenticated, Unauthenticated} from "convex/react";
import useAuth from "@/hooks/useAuth";

const Header = () => {
  const {isCurrentPathDashboard} = useAuth();

  return (
    <header className="sticky w-full border-b bottom-2 border-gray-200">
      <nav className="lg:px-20 px-5 py-5 mx-auto">
        <div className="flex justify-between ">
          <div className="hidden md:flex gap-10 items-center">
            <Link href="/">
              <div className="flex flex-col leading-5 font-bold text-xl">
                <span>Travel</span>
                <span>
                  Planner
                  <span className="text-blue-500">AI</span>
                </span>
              </div>
            </Link>
            <ul className="flex gap-8 items-center text-sm">
              {!isCurrentPathDashboard &&
                navlinks.map((link) => (
                  <li key={link} className="hover:underline cursor-pointer">
                    {link}
                  </li>
                ))}
            </ul>
          </div>
          <div className="md:hidden flex gap-6">
            <MobileMenu />
          </div>
          <div className="flex gap-4 justify-center items-center">
            <AuthLoading>
              <Loading />
            </AuthLoading>
            <Unauthenticated>
              <SignInButton mode="modal" afterSignInUrl="/dashboard" />
            </Unauthenticated>
            {!isCurrentPathDashboard && (
              <Authenticated>
                <Link
                  href="/dashboard"
                  className="bg-blue-500 text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-blue-700 h-10 px-4 py-2"
                >
                  Dashboard
                </Link>
              </Authenticated>
            )}
            <Authenticated>
              <UserButton afterSignOutUrl="/" />
            </Authenticated>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
