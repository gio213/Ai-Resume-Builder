import PremiumModal from "@/components/premium/PremiumModal";
import NavBar from "./NavBar";
import { auth } from "@clerk/nextjs/server";
import { getUserSubscriptionLevel } from "@/lib/subscriptions";
import { SubscriptionLevelProvider } from "./SubscriptionLevelProvider";

type LayoutType = {
  children: React.ReactNode;
};
export default async function Layout({ children }: LayoutType) {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const userSubscriptionLeve = await getUserSubscriptionLevel(userId!);
  return (
    <SubscriptionLevelProvider userSubscrionLevel={userSubscriptionLeve}>
      <div className="flex min-h-screen flex-col">
        <NavBar />
        {children}
        <PremiumModal />
      </div>
    </SubscriptionLevelProvider>
  );
}
