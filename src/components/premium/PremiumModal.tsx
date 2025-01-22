"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { useToast } from "@/hooks/use-toast";
import { createCheckoutSession } from "./actions";
import { env } from "@/env";
const premiumFeatures = ["AI tools", "Up to 3 resumes"];
const premiumPlusFeaturs = ["Infinite resumes", "Design customization"];

const PremiumModal = () => {
  const { open, setOpen } = usePremiumModal();

  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const handlePremimumClick = async (priceId: string) => {
    try {
      setLoading(true);
      const redirectUrl = await createCheckoutSession(priceId);
      window.location.href = redirectUrl;
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to create checkout session",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!loading) {
          setOpen(open);
        }
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Resume Builder AI Premium</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <p>Get a premium subscription to unlock more features.</p>
          <div className="flex">
            <div className="flex w-1/2 flex-col space-y-5">
              <h3 className="text-center text-lg font-bold">Premium</h3>
              <ul className="list-inside space-y-2">
                {premiumFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="size-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                disabled={loading}
                onClick={() =>
                  handlePremimumClick(env.NEXT_PUBLIC_STRIPE_ID_PRO_MONTHLY)
                }
                variant={"outline"}
              >
                Get Premium
              </Button>
            </div>
            <div className="mx-6 border-l" />
            <div className="flex w-1/2 flex-col space-y-5">
              <h3 className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-center text-lg font-bold text-transparent">
                Premium Plus
              </h3>
              <ul className="list-inside space-y-2">
                {premiumPlusFeaturs.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="size-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                disabled={loading}
                onClick={() =>
                  handlePremimumClick(
                    env.NEXT_PUBLIC_STRIPE_ID_PRO_PLUS_MONTHLY,
                  )
                }
                variant={"premium"}
              >
                Get Premium Plus
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;
