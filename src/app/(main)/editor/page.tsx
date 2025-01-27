import { Metadata } from "next";
import React from "react";
import ResumeEditor from "./ResumeEditor";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { resumeDataInclude } from "@/lib/types";
import { getTranslations } from "next-intl/server";

interface PageProps {
  searchParams: Promise<{ resumeId?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ResumeEditor");
  return {
    title: t("Design your resume"),
  };
}

const page = async ({ searchParams }: PageProps) => {
  const { resumeId } = await searchParams;
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const resumeToedit = resumeId
    ? await prisma.resume.findUnique({
        where: { id: resumeId, userId },
        include: resumeDataInclude,
      })
    : null;

  return <ResumeEditor resumeToedit={resumeToedit!} />;
};

export default page;
