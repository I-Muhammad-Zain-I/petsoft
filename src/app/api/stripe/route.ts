import Stripe from "stripe";
import stripe from "@/server/config/payment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { sendPetSoftPurchaseCongratulations } from "@/lib/mail";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return new NextResponse("invalid Signature", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  session.customer_email;

  if (event.type == "checkout.session.completed") {
    console.log("Payment was successful for User");
    if (!session.customer_email) {
      console.log("Stripe: Email does not exists");
    }
    const user = await prisma?.user.update({
      where: {
        email: session.customer_email,
      },
      data: {
        hasCompletedPayment: true,
      },
    });
    await sendPetSoftPurchaseCongratulations(user?.email);
  }
  console.log("stripeWebHook", body);
  return new NextResponse("ok", { status: 200 });
}

/**
 * Local Testing
 * in cmd
 * folder having stripe.exe from stripe github> stripe login
 * stripe listen --forward-to localhost:3000/api/stripe (app router)
 * DONE!
 */
