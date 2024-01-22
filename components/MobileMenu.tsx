"use client";

import {Button} from "@/components/ui/button";
import {navlinks} from "@/lib/constants";
import clsx from "clsx";
import {useState} from "react";
import {AiOutlineClose, AiOutlineMenu} from "react-icons/ai";

const MobileMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(!open)} variant="link" className="text-xl">
        <AiOutlineMenu />
      </Button>
      <div
        className={clsx(
          "fixed top-0 bg-teal-500 w-[40%] h-full text-white ease-in-out duration-700",
          open ? "left-0" : "left-[-100%]"
        )}
      >
        <div className="flex justify-end p-2">
          <Button
            onClick={() => setOpen(false)}
            variant="link"
            className="text-xl"
          >
            <AiOutlineClose className="text-white" />
          </Button>
        </div>
        <ul
          className="w-full flex flex-col gap-7 justify-center items-center
                        text-xl font-medium"
        >
          {navlinks.map((link) => (
            <li key={link} className="cursor-pointer">
              {link}
            </li>
          ))}
        </ul>
        {/*
        <li
          onClick={() => handleScroll(skillRef)}
          className="flex gap-2 items-center p-4 border-b border-b-primary  dark:border-b-white cursor-pointer hover:bg-white hover:text-black duration-500"
        >
          <FcDiploma2 className="text-xl" />
          <span>Skills</span>
        </li>
        <li
          onClick={() => handleScroll(aboutMeRef)}
          className="flex gap-2 items-center p-4 border-b border-b-primary  dark:border-b-white cursor-pointer hover:bg-white hover:text-black duration-500"
        >
          <FcBusinessman className="text-xl" />
          <span>About Me</span>
        </li>
        <li
          onClick={() => handleScroll(projectsRef)}
          className="flex gap-2 items-center p-4 border-b border-b-primary  dark:border-b-white cursor-pointer hover:bg-white hover:text-black duration-500"
        >
          <FcList className="text-xl" />
          <span>Projects</span>
        </li>
        <li className="flex gap-2 items-center p-4 border-b border-b-primary  dark:border-b-white cursor-pointer hover:bg-white hover:text-black duration-500">
          <FcCellPhone className="text-xl" />
          <span>Contact</span>
        </li> */}
      </div>
    </div>
  );
};

export default MobileMenu;
