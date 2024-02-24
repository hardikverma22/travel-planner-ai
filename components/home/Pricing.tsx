import {features} from "@/lib/constants";
import {CheckCircle2} from "lucide-react";

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="min-h-[100svh]
                     bg-gray-50 
                     w-full 
                     flex justify-center items-center
                     px-5 md:px-0 py-10 md:py-0"
    >
      <article className="flex flex-col gap-20">
        <div className="flex flex-col gap-5">
          <h2 className="text-blue-500 text-center text-lg font-bold tracking-wide">Pricing</h2>
          <h3 className="text-black text-center md:text-3xl text-xl font-bold ">
            Make your Travel Plan Today
          </h3>
        </div>
        <div className="ring-1 ring-gray-200 rounded-3xl p-8 xl:p-10 shadow-lg shadow-blue-500">
          <div className="flex items-center justify-between gap-x-4">
            <h3 id="tier-standard" className="text-blue-500 text-2xl font-semibold leading-8">
              5 Credits
            </h3>
          </div>

          <p className="mt-6 flex items-baseline gap-x-1">
            <span className="line-through text-2xl font-sans text-gray-500/70">₹400</span>
            <span className="text-5xl font-bold tracking-tight text-gray-900">₹80</span>
          </p>

          <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10">
            {features.map((faature, index) => (
              <li className="flex gap-x-3 text-base" key={index}>
                <CheckCircle2 className="h-6 w-5 flex-none text-blue-600" />
                {faature}
              </li>
            ))}
          </ul>

          <p className="text-xs text-gray-500 text-base-content-secondary/80 font-medium mt-5">
            One-time payment. No subscription
          </p>
        </div>
      </article>
    </section>
  );
};

export default Pricing;
