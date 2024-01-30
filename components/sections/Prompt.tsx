import SectionWrapper from "@/components/sections/SectionWrapper";
import {Lightbulb} from "lucide-react";

const Prompt = ({content}: {content: string | undefined}) => {
  return (
    <SectionWrapper id="imagination">
      <h2 className="mb-2 text-lg font-semibold underline underline-offset-2 tracking-wide flex items-center">
        <Lightbulb className="mr-2" />
        Your Imagination
      </h2>
      <div className="p-2 bg-stone-100 rounded-md w-fit ml-8">"{content}"</div>
    </SectionWrapper>
  );
};

export default Prompt;
