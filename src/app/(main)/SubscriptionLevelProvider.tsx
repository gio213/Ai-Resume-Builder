"use client";

import { SubscriptionLevel } from "@/lib/subscriptions";
import { createContext, useContext } from "react";

interface SubscriptionLevelProviderProps {
  children: React.ReactNode;
  userSubscrionLevel: SubscriptionLevel;
}

const SubscriptionLevelContext = createContext<SubscriptionLevel | undefined>(
  undefined,
);

export const SubscriptionLevelProvider = ({
  children,
  userSubscrionLevel,
}: SubscriptionLevelProviderProps) => {
  return (
    <SubscriptionLevelContext.Provider value={userSubscrionLevel}>
      {children}
    </SubscriptionLevelContext.Provider>
  );
};

export const useSubsciptionLevel = () => {
  const context = useContext(SubscriptionLevelContext);
  if (context === undefined) {
    throw new Error(
      "useSubscriptionLevel must be used within a SubscriptionLevelProvider",
    );
  }
  return context;
};
