import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "AI Resume Builder – Create a Professional CV in Minutes",
  description:
    "Create professional resumes instantly with our AI-powered resume builder. Free templates, customizable sections, and quick downloads in PDF.",
  alternates: {
    canonical: "/",
    languages: {
      "ka-GE": "/",
      "en-US": "/",
      "x-default": "/",
    },
  },
};

export default function Home() {
  return <HomeClient />;
}
