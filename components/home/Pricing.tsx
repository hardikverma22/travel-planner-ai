import {features} from "@/lib/constants";
import {CheckCircle2} from "lucide-react";

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="min-h-[100svh]
                     bg-background 
                     w-full 
                     flex flex-col gap-5 justify-center items-center
                     px-5 md:px-0 py-10 md:py-0"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-blue-500 text-center text-lg font-bold tracking-wide">Pricing</h2>
        <h3 className="text-foreground text-center md:text-3xl text-xl font-bold ">
          Make your Travel Plan Today
        </h3>
      </div>
      <div className="flex gap-5 flex-col md:flex-row">
        <PricingCard isFreePlan={true} />
        <PricingCard isFreePlan={false} />
      </div>
    </section>
  );
};

const PricingCard = ({isFreePlan}: {isFreePlan: boolean}) => {
  return (
    <article
      className="flex flex-col justify-between flex-1 min-w-96 md:min-w-80
                       ring-1 ring-muted rounded-3xl p-8 shadow-xl shadow-blue-200 dark:shadow-none
                       "
    >
      <div className="flex flex-col">
        <div>{isFreePlan ? "Free" : "Paid"} Plan</div>
        <h3 id="tier-standard" className="text-blue-500 text-2xl font-extrabold leading-8">
          {isFreePlan ? "1 Credit" : "5 Credits"}
        </h3>
        <p className="mt-3 flex items-baseline gap-x-1">
          <span className="line-through text-2xl font-sans text-muted-foreground/70">₹400</span>
          <span className="text-3xl font-bold tracking-tight text-muted-foreground">
            {isFreePlan ? "₹0" : "₹80"}
          </span>
        </p>
      </div>
      <div className="flex flex-col">
        <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-foreground xl:mt-10">
          {features.map((faature, index) => (
            <li className="flex gap-x-3 text-base" key={index}>
              <CheckCircle2 className="h-6 w-5 flex-none text-blue-600" />
              {faature}
            </li>
          ))}
        </ul>

        <p className="text-xs text-muted-foreground text-base-content-secondary/80 font-medium mt-5">
          {isFreePlan ? "Free Plan" : "One-time payment"}. No subscription
        </p>
      </div>
    </article>
  );
};

export default Pricing;
