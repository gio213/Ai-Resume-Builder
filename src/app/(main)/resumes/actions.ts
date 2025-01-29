"use server";

import { env } from "@/env";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs/server";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export const deleteResume = async (id: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const resume = await prisma.resume.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!resume) {
    throw new Error("Resume not found");
  }

  if (resume.photoUrl) {
    await del(resume.photoUrl);
  }
  await prisma.resume.delete({
    where: {
      id,
    },
  });
  revalidatePath("/resumes");
};

export const createCheckoutSession = async (resumeId: string) => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: env.NEXT_PUBLIC_STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      resumeId,
    },
    success_url: `${env.NEXT_PUBLIC_BASE_URL}/resumes?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/resumes?canceled=true`,
    payment_intent_data: {
      description: `Resume purchase for user ${userId}`,
      receipt_email: user?.emailAddresses[0].emailAddress,
    },
  });

  return session.url;
};
