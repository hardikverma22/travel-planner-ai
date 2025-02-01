import { navlinks } from "@/lib/constants";
import Link from "next/link";

export default function MenuItems() {
  return (
    <>
      {navlinks.map((link) => (
        <li
          key={link.id}
          className="hover:underline hover:underline-offset-4 transition-all duration-300 cursor-pointer 
          text-foreground"
        >
          <Link href={`/#${link.id}`}>{link.text}</Link>
        </li>
      ))}
    </>
  );
}
