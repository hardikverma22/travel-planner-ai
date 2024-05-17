"use client";

import {api} from "@/convex/_generated/api";
import {useAction, useQuery} from "convex/react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import Image from "next/image";
import empty_cart from "@/public/empty_cart.svg";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {useMediaQuery} from "@/hooks/useMediaQuery";
import {Drawer, DrawerContent, DrawerTrigger} from "@/components/ui/drawer";
import NewPlanForm from "@/components/NewPlanForm";
import {Backpack, Loader} from "lucide-react";

const DrawerWithDialog = ({shouldOpenForCreatePlan = false}) => {
  const user = useQuery(api.users.currentUser);
  const boughtCredits = user?.credits ?? 0;
  const freeCredits = user?.freeCredits ?? 0;
  const totalCredits = freeCredits + boughtCredits;

  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const btnText = shouldOpenForCreatePlan ? "Create Travel Plan" : `Credits ${totalCredits ?? 0}`;

  const shouldShowCreatePlanForm = shouldOpenForCreatePlan && totalCredits > 0;

  const content = shouldShowCreatePlanForm ? (
    <>
      <DialogHeader>
        <DialogTitle>Create Travel Plan</DialogTitle>
      </DialogHeader>
      <NewPlanForm />
    </>
  ) : (
    <CreditContent boughtCredits={boughtCredits} freeCredits={freeCredits} />
  );

  if (isDesktop) {
    return (
      <>
        <Button
          aria-label={`open dialog button for ${btnText}`}
          variant={`${!shouldOpenForCreatePlan ? "link" : "default"}`}
          className={`${
            shouldOpenForCreatePlan && "bg-blue-500  hover:bg-blue-600 text-white flex gap-1"
          }`}
          onClick={() => {
            setOpen(true);
          }}
        >
          {shouldOpenForCreatePlan && <Backpack className="h-4 w-4" />}
          <span>{btnText}</span>
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
        <Button
          variant="outline"
          aria-label={`open drawer for ${btnText}`}
          className={`${
            shouldOpenForCreatePlan && "bg-blue-500 text-white hover:bg-blue-600 flex gap-1"
          }`}
        >
          {shouldOpenForCreatePlan && <Backpack className="h-4 w-4" />}
          <span>{btnText}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex flex-col gap-10 p-5">{content}</DrawerContent>
    </Drawer>
  );
};

export const CreditContent = ({
  boughtCredits,
  freeCredits,
}: {
  boughtCredits: number;
  freeCredits: number;
}) => {
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
      {boughtCredits > 0 || freeCredits > 0 ? (
        <div className="flex gap-2 justify-between items-center p-2">
          <div className="flex flex-col gap-1 justify-center items-center p-10 rounded-lg border-2 flex-1">
            <span>Free Credits</span>
            <span className="font-bold text-7xl">{freeCredits}</span>
          </div>
          <div className="flex flex-col gap-1 justify-center items-center p-10 rounded-lg border-2 flex-1">
            <span>Bought Credits</span>
            <span className="font-bold text-7xl">{boughtCredits}</span>
          </div>
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
        aria-label="buy credits"
        className="bg-blue-500 text-white hover:bg-blue-600"
        onClick={handleBuyCredits}
        disabled={startBuying}
      >
        {startBuying && <Loader className="mr-2 animate-spin" />}Buy Credits
      </Button>
    </>
  );
};

export default DrawerWithDialog;
