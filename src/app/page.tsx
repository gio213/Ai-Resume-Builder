"use client";
import Image from "next/image";
import resumePrevwEng from "@/assets/resume-prew-en.webp";
import resumePrevwGeo from "@/assets/resume-prew-geo.webp";
import { useCookies } from "next-client-cookies";
import dottBg from "@/assets/dotted-pattern.webp";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import NavBar from "./(main)/NavBar";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import newvector from "@/assets/rb_5166.png";
export default function Home() {
  const t = useTranslations("Home");
  const cookies = useCookies();
  const [resumePrew, setResumePrew] = useState(resumePrevwGeo);
  const { theme } = useTheme();
  console.log("theme", theme);

  useEffect(() => {
    const locale = cookies.get("locale") || "ka";
    if (locale === "ka") {
      setResumePrew(resumePrevwGeo);
    } else {
      setResumePrew(resumePrevwEng);
    }
    return () => {
      setResumePrew(resumePrevwGeo);
    };
  }, [cookies]);

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundImage: `url(${dottBg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <NavBar />

      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-5 py-12 text-center md:flex-row md:text-start lg:gap-12">
        <div className="flex max-w-prose flex-col items-center justify-center space-y-6 md:items-start">
          <Image
            loader={({ src }) => src}
            src={newvector}
            alt="Logo"
            width={350}
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

        <div className="relative mt-6 md:mt-0">
          <Image
            loader={({ src }) => src}
            src={resumePrew}
            alt="Resume preview"
            width={450}
            height={600}
            className="transform animate-[drop_1.5s_ease-in-out_forwards,settle_0.5s_ease-in-out_1.5s_forwards] shadow-2xl"
          />

          <style jsx global>{`
            @keyframes drop {
              0% {
                transform: translateY(-100vh) rotate(-30deg) scale(0.5);
                opacity: 0;
              }
              70% {
                transform: translateY(0) rotate(0deg) scale(1);
                opacity: 1;
              }
              85% {
                transform: translateY(-20px) rotate(2deg) scale(1);
              }
              100% {
                transform: translateY(0) rotate(5deg) scale(1);
              }
            }

            @keyframes settle {
              0% {
                transform: translateY(0) rotate(5deg) scale(1);
              }
              50% {
                transform: translateY(-5px) rotate(6deg) scale(1);
              }
              100% {
                transform: translateY(0) rotate(5deg) scale(1);
              }
            }
          `}</style>
        </div>
      </main>
    </div>
  );
}
