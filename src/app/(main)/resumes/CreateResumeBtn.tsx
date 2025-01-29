"use client";
import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

const CreateResumeBtn = () => {
  const t = useTranslations("CreateResumeBtn");

  return (
    <Button asChild className="mx-auto flex w-fit gap-2">
      <Link href={"/editor"}>
        <PlusSquare className="size-5" />
        {t("New resume")}
      </Link>
    </Button>
  );
};

export default CreateResumeBtn;
