import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { CookiesProvider } from "next-client-cookies/server";
import Head from "next/head";
const inter = Inter({ subsets: ["latin"] });

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("Layout");

  const baseUrl = "https://www.resumes.ge";
  const primaryKeywords = [
    "resume builder",
    "AI resume writer",
    "professional resume",
    "CV maker",
    "resume templates",
    "Georgian resume",
    "free resume builder",
    "AI resume summary",
    "resume download",
    "custom resume creator",
    "რეზიუმეს შემქმნელი",
    "AI რეზიუმეს მწერალი",
    "პროფესიონალური რეზიუმე",
    "CV შემქმნელი",
    "რეზიუმეს შაბლონები",
    "ქართული რეზიუმე",
    "AI რეზიუმეს შეჯამება",
    "რეზიუმეს ჩამოტვირთვა",
    "მორგებული რეზიუმეს შემქმნელი",
  ].join(", ");

  return {
    title: {
      template: "%s | " + t("Professional AI Resume Builder"),
      absolute: t("Create Professional Resumes with AI Free Resume Builder"),
      default: t("Free Resume Builder Create Professional Resumes with AI"),
    },
    description: t(
      "Create professional resumes instantly with our AI powered resume builder Free customizable templates AI resume summary writing multiple export formats and expert guidance Build your perfect resume today",
    ),

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    applicationName: t("Professional AI Resume Builder"),
    keywords: primaryKeywords,
    authors: [{ name: "Giorgi Patsia" }],
    category: "Career Tools",
    creator: "Giorgi Patsia",
    generator: "Next.js",

    alternates: {
      canonical: baseUrl,
    },

    openGraph: {
      title: t("Create Professional Resumes with AI Free Resume Builder"),
      description: t(
        "Build impressive resumes instantly with AI-powered tools Free templates customization options and professional resume summary writing assistance",
      ),
      type: "website",
      url: baseUrl,
      locale: "ka_GE",
      images: [
        {
          url: "https://res.cloudinary.com/dimy1fj2c/image/upload/v1738314619/vector_copy_tbyehp.jpg", // Update with your actual OG image path
          width: 1200,
          height: 630,
          alt: t("AI Resume Builder Interface"),
        },
      ],
      siteName: t("Resumes ge Professional AI Resume Builder"),
    },

    twitter: {
      card: "summary_large_image",
      title: t("Create Professional Resumes with AI Free Resume Builder"),
      description: t(
        "Build impressive resumes instantly with AI powered tools Free templates customization options and professional resume summary writing assistance",
      ),
      images: [
        "https://res.cloudinary.com/dimy1fj2c/image/upload/v1738314619/vector_copy_tbyehp.jpg",
      ], // Update with your actual Twitter image path
    },
    facebook: {
      appId: "965909851625158",
    },

    verification: {
      google: "rK9_-vqN901L4ekHjv0up-dujJGqARtF0_8qY6kvHMc",
    },

    other: {
      "msapplication-TileColor": "#ffffff",
      "theme-color": "#ffffff",
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
        <Head>
          <title>Professional AI Resume Builder</title>
          <meta
            name="description"
            content="Create professional resumes instantly with our AI powered resume builder. Free customizable templates, AI resume summary writing, multiple export formats, and expert guidance. Build your perfect resume today."
          />
          <meta name="robots" content="index, follow" />
          <meta
            name="googlebot"
            content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"
          />
          <meta
            name="application-name"
            content="Professional AI Resume Builder"
          />
          <meta
            name="keywords"
            content="AI რეზიუმეს შეჯამება, რეზიუმეს ჩამოტვირთვა, მორგებული რეზიუმეს შემქმნელი"
          />
          <meta name="author" content="Giorgi Patsia" />
          <meta name="category" content="Career Tools" />
          <meta name="creator" content="Giorgi Patsia" />
          <meta name="generator" content="Next.js" />
          <link rel="canonical" href="https://resumes.ge" />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Resumes.ge",
              url: "https://resumes.ge",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.resumes.ge/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            })}
          </script>
        </Head>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider messages={messages}>
              <CookiesProvider>{children}</CookiesProvider>
            </NextIntlClientProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
