"use client";
import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { createCustumerPortalSession } from "./actions";

const ManageSubscriptionBtn = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      const redirectUrl = await createCustumerPortalSession();
      window.location.href = redirectUrl;
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to manage subscription",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadingButton onClick={handleClick} loading={loading}>
      Manage Subscription
    </LoadingButton>
  );
};

export default ManageSubscriptionBtn;
