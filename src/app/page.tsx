"use client";
import Image from "next/image";
import logo from "@/assets/logo.png";
import resumePrevewImage from "@/assets/resume-preview.jpg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LangugageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <main className="bg-foregroundpx-5 relative flex min-h-screen flex-col items-center justify-center gap-6 py-12 text-center text-gray-900 md:flex-row md:text-start lg:gap-12">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <div className="max-w-prose space-y-3">
        <Image
          loader={({ src }) => src}
          src={logo}
          alt="Logo"
          width={150}
          height={150}
          className="mx-auto md:ms-0"
        />
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
          {t("Create the")}{" "}
          <span className="bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent contain-inline-size">
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
      <div>
        <Image
          src={resumePrevewImage}
          loader={({ src }) => src}
          alt="Resume preview"
          width={500}
          height={600}
          className="shadow-md lg:rotate-[1.5deg]"
        />
      </div>
    </main>
  );
}
