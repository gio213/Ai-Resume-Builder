"use client";
import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { PlusSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

interface CreateResumeBtnProps {
  canCreate: boolean;
}

const CreateResumeBtn = ({ canCreate }: CreateResumeBtnProps) => {
  const premiumModal = usePremiumModal();
  const t = useTranslations("CreateResumeBtn");

  if (canCreate) {
    return (
      <Button asChild className="mx-auto flex w-fit gap-2">
        <Link href={"/editor"}>
          <PlusSquare className="size-5" />
          {t("New resume")}
        </Link>
      </Button>
    );
  }
  return (
    <Button
      onClick={() => premiumModal.setOpen(true)}
      className="mx-auto flex w-fit gap-2"
    >
      <PlusSquare className="size-5" />
      {t("New resume")}
    </Button>
  );
};

export default CreateResumeBtn;
