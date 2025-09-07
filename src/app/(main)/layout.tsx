import NavBar from "./NavBar";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";

type LayoutType = {
  children: React.ReactNode;
};
export default async function Layout({ children }: LayoutType) {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      {children}
    </div>
  );
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
