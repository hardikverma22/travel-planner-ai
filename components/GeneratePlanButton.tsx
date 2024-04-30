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
      className="bg-blue-500 text-white hover:bg-blue-700 text-md font-semibold"
    >
      Try Now - 1 Free Credits
    </Button>
  );
};

export default GeneratePlanButton;
