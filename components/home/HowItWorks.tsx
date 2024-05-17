import {cn} from "@/lib/utils";
import arrow from "@/public/arrow.png";
import {Lightbulb, LogIn, PlaneTakeoff} from "lucide-react";
import Image from "next/image";
import {ReactNode} from "react";

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="min-h-[100svh]
                     bg-background/90
                     w-full 
                     flex justify-center items-center
                     px-5 md:px-0 py-10 md:py-0"
    >
      <div className="flex flex-col gap-20">
        <section className="flex flex-col gap-5">
          <h2 className="text-blue-500 text-center text-lg font-bold tracking-wide">
            How it works?
          </h2>
          <h3 className="text-foreground text-center md:text-3xl text-xl font-bold ">
            Craft Your Ideal Journey Swiftly
          </h3>
        </section>
        <section className="flex items-center justify-center gap-28 w-full h-full flex-col md:flex-row">
          <Item
            text="Login"
            description="Log in to start your journey."
            icon={<LogIn className="h-8 w-8 text-blue-500 dark:text-foreground" />}
            className="rotate-[202deg] hidden md:block"
          />
          <Item
            text="Key in the travel idea"
            description="Tell us about your ideal trip"
            icon={<Lightbulb className="h-8 w-8 text-blue-500 dark:text-foreground" />}
            className="transform rotate-[350deg] -scale-x-100 hidden md:block"
          />

          <Item
            text="Get AI Plan"
            description="Get your AI-driven tailored travel plan"
            icon={<PlaneTakeoff className="h-8 w-8 text-blue-500 dark:text-foreground" />}
            className="hidden"
          />
        </section>
      </div>
    </section>
  );
};

const Item = ({
  text,
  icon,
  description,
  className,
}: {
  text: string;
  icon: ReactNode;
  description: string;
  className?: string;
}) => {
  return (
    <article className="flex flex-col items-center justify-center gap-5 relative">
      <div className="bg-muted w-24 h-24 rounded-2xl shadow-2xl items-center flex justify-center">
        {icon}
      </div>
      <span className="font-bold tracking-wide text-lg mt-5">{text}</span>
      <span className="text-sm w-2/3 text-center text-muted-foreground">{description}</span>

      <Image
        src={arrow}
        width={100}
        height={100}
        alt="arrow"
        className={cn("absolute -right-[120px] top-[15%] opacity-40", className)}
      />
    </article>
  );
};

export default HowItWorks;
