import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";

const inter = Inter({ subsets: ["latin"] });

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("Layout");
  return {
    title: {
      template: "%s | " + t("AI Resume Builder"),
      absolute: t("AI Resume Builder"),
      default: t("AI Resume Builder"),
    },
    description: t("AI Resume Builder for professional resumes!"),
    robots: "follow, index",
    applicationName: t("AI Resume Builder"),
    keywords: t("resume, builder, ai, professional, free"),
    authors: [{ name: "Giorgi Patsia" }],
    category: "SASS",
    creator: "Giorgi Patsia",
    generator: "Next.js",
    openGraph: {
      title: t("AI Resume Builder"),
      description: t("AI Resume Builder for professional resumes!"),
      type: "website",
      url: "https://www.ai-resume-builder.vercel.app",
      locale: "en_US",
      images: [
        {
          url: "https://raw.githubusercontent.com/gio213/Ai-Resume-Builder/refs/heads/main/src/assets/logo.png?token=GHSAT0AAAAAAC4NWWNBBOURI7OWJKTCUPBGZ4XTGXA",
          width: 1200,
          height: 630,
          alt: t("AI Resume Builder"),
        },
      ],
      siteName: t("AI Resume Builder"),
    },
  };
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <ClerkProvider>
      <html lang={locale} suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
