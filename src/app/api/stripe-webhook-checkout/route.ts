import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { NextRequest } from "next/server";
import Stripe from "stripe";
import { PaymentStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    // ❗ Ensure raw body is used
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("Missing Stripe signature");
      return new Response(
        JSON.stringify({ error: "Missing Stripe signature" }),
        { status: 400 },
      );
    }

    // ❗ Ensure STRIPE_WEBHOOK_SECRET is set
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Missing STRIPE_WEBHOOK_SECRET in environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500 },
      );
    }

    // ❗ Construct Stripe event (fixes "payload must be an object" error)
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("⚠️ Stripe signature verification failed:", err);
      return new Response(
        JSON.stringify({ error: "Webhook signature verification failed" }),
        { status: 400 },
      );
    }

    // Debugging log
    console.log("✅ Stripe event received:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCompleted(session);
    }

    // Handle payment_intent.succeeded event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentIntentSucceeded(paymentIntent);
    }

    // Handle payment_intent.payment_failed event
    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentIntentPaymentFailed(paymentIntent);
    }

    // Handle payment_intent.canceled event
    if (event.type === "payment_intent.canceled") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentIntentCanceled(paymentIntent);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
      },
    );
  }
}
// Handling PaymentIntent success event
const handlePaymentIntentSucceeded = async (
  paymentIntent: Stripe.PaymentIntent,
) => {
  if (!paymentIntent || !paymentIntent.id) {
    throw new Error("Invalid payment intent data");
  }

  console.log("Processing successful payment:", paymentIntent.id);

  try {
    // Verify if the payment is associated with a resume
    const payment = await prisma.payment.findUnique({
      where: {
        stripePaymentIntentId: paymentIntent.id,
      },
    });

    if (!payment) {
      console.error(
        `❌ Payment not found for PaymentIntent ID: ${paymentIntent.id}`,
      );
      throw new Error(
        `Payment not found for PaymentIntent ID: ${paymentIntent.id}`,
      );
    }

    // Proceed to update the payment status and resume
    await prisma.$transaction(async (tx) => {
      await tx.payment.updateMany({
        where: {
          stripePaymentIntentId: paymentIntent.id,
        },
        data: {
          status: PaymentStatus.SUCCESS,
          amount: paymentIntent.amount_received || paymentIntent.amount,
          currency: paymentIntent.currency,
        },
      });

      await tx.resume.update({
        where: { id: payment.resumeId },
        data: { isPaid: true },
      });

      console.log("✅ Payment and resume status updated successfully!");
    });
  } catch (error) {
    console.error("❌ Error handling payment_intent.succeeded:", error);
    throw error;
  }
};

// Handling PaymentIntent failed event
const handlePaymentIntentPaymentFailed = async (
  paymentIntent: Stripe.PaymentIntent,
) => {
  if (!paymentIntent || !paymentIntent.id) {
    throw new Error("Invalid payment intent data");
  }

  console.log("Processing failed payment:", paymentIntent.id);

  try {
    // Verify the payment and find the associated resume
    const payment = await prisma.payment.findUnique({
      where: {
        stripePaymentIntentId: paymentIntent.id,
      },
      select: {
        resumeId: true,
      },
    });

    if (!payment) {
      console.error(
        `❌ Payment not found for PaymentIntent ID: ${paymentIntent.id}`,
      );
      throw new Error(
        `Payment not found for PaymentIntent ID: ${paymentIntent.id}`,
      );
    }

    // Update payment status to failed and set isPaid to false for the resume
    await prisma.$transaction(async (tx) => {
      await tx.payment.updateMany({
        where: {
          stripePaymentIntentId: paymentIntent.id,
        },
        data: {
          status: PaymentStatus.FAILED,
        },
      });

      await tx.resume.update({
        where: {
          id: payment.resumeId,
        },
        data: {
          isPaid: false,
        },
      });

      console.log("✅ Payment failed and resume status updated!");
    });
  } catch (error) {
    console.error("❌ Error handling payment_intent.payment_failed:", error);
    throw error;
  }
};
// Handling Checkout Session completed event
const handleCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session,
) => {
  if (!session) {
    throw new Error("Invalid checkout session data");
  }

  console.log("✅ Stripe event received: checkout.session.completed");
  console.log("Processing completed checkout session:", session.id);
  console.log("Session metadata type:", typeof session.metadata);
  console.log("Session metadata:", session.metadata);

  try {
    if (
      !session.metadata ||
      !session.metadata.userId ||
      !session.metadata.resumeId
    ) {
      console.error("❌ Missing required metadata:", session.metadata);
      throw new Error("Missing required metadata in checkout session");
    }

    const { userId, resumeId } = session.metadata as {
      userId: string;
      resumeId: string;
    };

    console.log("UserId:", userId);
    console.log("ResumeId:", resumeId);
    console.log("Payment Intent:", session.payment_intent);
    console.log("Amount:", session.amount_total);
    console.log("Currency:", session.currency);

    if (!resumeId || !userId) {
      throw new Error("❌ Missing resumeId or userId");
    }

    console.log("Verifying if resume exists in DB...");

    const existingResume = await prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!existingResume) {
      console.error(`❌ Resume not found: ${resumeId}`);
      throw new Error(`Resume not found: ${resumeId}`);
    }

    console.log("✅ Resume found. Updating payment and resume status...");

    // Prisma transaction for atomic updates
    await prisma.$transaction(async (tx) => {
      await tx.payment.upsert({
        where: { resumeId },
        update: {
          status: "SUCCESS",
          amount: session.amount_total ? Number(session.amount_total) : 0,
          currency: session.currency || "usd",
          stripePaymentIntentId: session.payment_intent?.toString() || "",
          userId,
        },
        create: {
          userId,
          resumeId,
          status: "SUCCESS",
          amount: session.amount_total ? Number(session.amount_total) : 0,
          currency: session.currency || "usd",
          stripePaymentIntentId: session.payment_intent?.toString() || "",
        },
      });

      await tx.resume.update({
        where: { id: resumeId },
        data: { isPaid: true },
      });

      console.log("✅ Transaction completed successfully!");
    });
  } catch (error) {
    console.error("❌ Error processing checkout session:", error);

    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    throw error;
  }
};

// Handling PaymentIntent canceled event
const handlePaymentIntentCanceled = async (
  paymentIntent: Stripe.PaymentIntent,
) => {
  if (!paymentIntent || !paymentIntent.id) {
    throw new Error("Invalid payment intent data");
  }

  console.log("Processing canceled payment:", paymentIntent.id);

  try {
    // Verify the payment and find the associated resume
    const payment = await prisma.payment.findUnique({
      where: {
        stripePaymentIntentId: paymentIntent.id,
      },
      select: {
        resumeId: true,
      },
    });

    if (!payment) {
      console.error(
        `❌ Payment not found for PaymentIntent ID: ${paymentIntent.id}`,
      );
      throw new Error(
        `Payment not found for PaymentIntent ID: ${paymentIntent.id}`,
      );
    }

    // Update payment status to canceled and set isPaid to false for the resume
    await prisma.$transaction(async (tx) => {
      await tx.payment.updateMany({
        where: {
          stripePaymentIntentId: paymentIntent.id,
        },
        data: {
          status: PaymentStatus.CANCELED,
        },
      });

      await tx.resume.update({
        where: {
          id: payment.resumeId,
        },
        data: {
          isPaid: false,
        },
      });

      console.log("✅ Payment canceled and resume status updated!");
    });
  } catch (error) {
    console.error("❌ Error handling payment_intent.canceled:", error);
    throw error;
  }
};
