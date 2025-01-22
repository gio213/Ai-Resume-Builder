"use client";
import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import React from "react";

const GetSubscriptionBtn = () => {
  const premiumModel = usePremiumModal();
  return (
    <Button onClick={() => premiumModel.setOpen(true)} variant={"premium"}>
      Get Premium Subscription
    </Button>
  );
};

export default GetSubscriptionBtn;
