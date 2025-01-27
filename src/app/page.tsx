"use client";
import Image from "next/image";
import logo from "@/assets/logo.png";
import resumePrevewImage from "@/assets/resume-preview.jpg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

import NavBar from "./(main)/NavBar";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-5 py-12 text-center md:flex-row md:text-start lg:gap-12">
        <div className="flex max-w-prose flex-col items-center justify-center space-y-6 md:items-start">
          <Image
            loader={({ src }) => src}
            src={logo}
            alt="Logo"
            width={150}
            height={150}
            className="mx-auto md:mx-0"
          />
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
            {t("Create the")}{" "}
            <span className="bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
              {t(" Perfect Resume")}
            </span>{" "}
            {t("in minutes")}
          </h1>

          <p className="text-lg text-gray-500">
            {t("Professional resumes, made easy!")}
          </p>

          <Button asChild size="lg" variant="premium">
            <Link href="/resumes">{t("Get started")}</Link>
          </Button>
        </div>

        <div className="mt-6 md:mt-0">
          <Image
            src={resumePrevewImage}
            loader={({ src }) => src}
            alt="Resume preview"
            width={400}
            height={600}
            className="shadow-2xl lg:rotate-[5deg]"
          />
        </div>
      </main>
    </div>
  );
}
