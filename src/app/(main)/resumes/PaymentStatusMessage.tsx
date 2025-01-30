"use client";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const PaymentStatusMessage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isSuccess = searchParams.get("success") === "true";
  const canceled = searchParams.get("canceled") === "true";
  const { toast } = useToast();

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Payment successful",
        variant: "default",
      });
      // Remove query parameters from URL
      router.replace(window.location.pathname);
    } else if (canceled) {
      toast({
        title: "Payment canceled",
        variant: "destructive",
      });
      // Remove query parameters from URL
      router.replace(window.location.pathname);
    } else if (searchParams.has("success") || searchParams.has("canceled")) {
      toast({
        title: "Payment failed",
        variant: "destructive",
      });
      // Remove query parameters from URL
      router.replace(window.location.pathname);
    }
  }, [isSuccess, canceled, toast, router, searchParams]);

  return null; // No need to render anything
};

export default PaymentStatusMessage;
