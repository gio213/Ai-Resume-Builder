import NavBar from "./NavBar";
import { auth } from "@clerk/nextjs/server";

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
