"use client";
import {Button} from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";

const GeneratePlanButton = () => {
  const {openSignInPopupOrDirect} = useAuth();
  return (
    <Button
      aria-label="generate plan"
      onClick={openSignInPopupOrDirect}
      variant="default"
      size="lg"
      className="bg-blue-500 text-white hover:bg-blue-700 text-md uppercase font-sans"
    >
      Try Now
    </Button>
  );
};

export default GeneratePlanButton;
