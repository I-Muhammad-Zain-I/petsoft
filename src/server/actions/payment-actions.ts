"use server";
import { redirect } from "next/navigation";
import stripe from "../config/payment";

import { auth } from "@/auth";

const createCheckoutSession = async () => {
  const session = await auth();

  if (!session) {
    return { error: "Session null, cannot proceed to checkout" };
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: session.user?.email!,
    line_items: [
      {
        price: "price_1QB8sRRuuDG2jDrHMFFkM3F7",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.BASE_URL}/payment?success=true`,
    cancel_url: `${process.env.BASE_URL}/payment?cancel=true`,
    metadata: {
      userId: session.user.id,
    },
  });

  console.log(checkoutSession.url);
  redirect(checkoutSession.url);
};

export { createCheckoutSession };
