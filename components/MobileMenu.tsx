"use client";

import {Button} from "@/components/ui/button";
import {navlinks} from "@/lib/constants";
import clsx from "clsx";
import {useState} from "react";
import {AiOutlineClose, AiOutlineMenu} from "react-icons/ai";
import Link from "next/link";

type MobileMenuProps = {
  isCurrentPathHome: boolean;
  isCurrentPathDashboard: boolean;
};

const MobileMenu = ({
  isCurrentPathHome,
  isCurrentPathDashboard,
}: MobileMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(!open)} variant="link" className="text-xl">
        <AiOutlineMenu />
      </Button>
      <div
        className={clsx(
          "fixed top-0 bg-white w-[40%] border-r-2 border-neutral-200 h-full ease-in-out duration-700",
          open ? "left-0 z-50" : "left-[-100%]"
        )}
      >
        <div className="flex justify-between p-2">
          <Link href="/">
            <div
              className="flex flex-col leading-5
                             font-bold text-xl p-2"
            >
              <span>Travel</span>
              <span>
                Planner
                <span className="text-blue-500 ml-0.5">AI</span>
              </span>
            </div>
          </Link>
          <Button
            onClick={() => setOpen(false)}
            variant="link"
            className="text-xl"
          >
            <AiOutlineClose />
          </Button>
        </div>
        <ul
          className="w-full flex flex-col gap-7 justify-center items-start
                      p-5  text-md font-medium"
        >
          {isCurrentPathHome &&
            navlinks.map((link) => (
              <li key={link.id} className="hover:underline cursor-pointer">
                <Link href={`/#${link.id}`} scroll>
                  {link.text}
                </Link>
              </li>
            ))}
          {!isCurrentPathDashboard && (
            <li className="hover:underline cursor-pointer">
              <Link href="/dashboard">Dashboard</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MobileMenu;
