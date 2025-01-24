"use client";
import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { useTranslations } from "next-intl";
import React from "react";

const GetSubscriptionBtn = () => {
  const premiumModel = usePremiumModal();
  const t = useTranslations("Billing");
  return (
    <Button onClick={() => premiumModel.setOpen(true)} variant={"premium"}>
      {t("Get Premium Subscription")}
    </Button>
  );
};

export default GetSubscriptionBtn;
