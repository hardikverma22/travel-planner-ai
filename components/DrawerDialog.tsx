"use client";

import {api} from "@/convex/_generated/api";
import {useAction, useQuery} from "convex/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import empty_cart from "@/public/empty_cart.svg";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {useMediaQuery} from "@/hooks/useMediaQuery";
import {Drawer, DrawerContent, DrawerTrigger} from "@/components/ui/drawer";
import NewPlanForm from "@/components/NewPlanForm";
import {Loader} from "lucide-react";

const DrawerDialog = ({shouldOpenForCreatePlan = false}) => {
  const credits = useQuery(api.users.currentUser)?.credits;

  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const btnText = shouldOpenForCreatePlan
    ? "Create Travel Plan"
    : `Credits ${credits ?? 0}`;

  const shouldShowCreatePlanForm = credits && shouldOpenForCreatePlan;

  const content = shouldShowCreatePlanForm ? (
    <>
      <DialogHeader>
        <DialogTitle>Create Travel Plan</DialogTitle>
      </DialogHeader>
      <NewPlanForm />
    </>
  ) : (
    <CreditContent credits={credits} />
  );

  if (isDesktop) {
    return (
      <>
        <Button
          variant={`${!shouldOpenForCreatePlan ? "link" : "default"}`}
          className={`${
            shouldOpenForCreatePlan &&
            "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          onClick={() => {
            setOpen(true);
          }}
        >
          {btnText}
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>{content}</DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">{btnText}</Button>
      </DrawerTrigger>
      <DrawerContent className="flex flex-col gap-10 p-5">
        {content}
      </DrawerContent>
    </Drawer>
  );
};

export const CreditContent = ({credits}: {credits: number | undefined}) => {
  const buyCredits = useAction(api.stripe.pay);
  const [startBuying, setStartBuying] = useState(false);

  const handleBuyCredits = async () => {
    setStartBuying(true);
    const paymentUrl = await buyCredits();
    if (paymentUrl == null) return;
    // Redirect to Stripe's checkout website
    window.location.href = paymentUrl!;
  };

  return (
    <>
      {credits ? (
        <div className="flex flex-col gap-2 justify-center items-center">
          <h1>Your Credits</h1>
          <span className="font-bold text-7xl">{credits}</span>
        </div>
      ) : (
        <div className="flex flex-col gap-10 justify-center items-center">
          <h1 className="font-bold text-xl">You are out of credits!</h1>
          <Image
            alt="Empty Cart"
            src={empty_cart}
            width={300}
            height={300}
            className="bg-contain"
          />
        </div>
      )}
      <Button
        className="bg-blue-500 text-white hover:bg-blue-600"
        onClick={handleBuyCredits}
        disabled={startBuying}
      >
        {startBuying && <Loader className="mr-2 animate-spin" />}Buy Credits
      </Button>
    </>
  );
};

export default DrawerDialog;
