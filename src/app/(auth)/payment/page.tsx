"use client";

import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/server/actions/payment-actions";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useTransition } from "react";
import Link from "next/link";
const PaymentPage = () => {
  const session = useSession(); // calling to update session on strip redirect to app
  const searchParams = useSearchParams();
  const isPaymentSuccess = searchParams.get("success");
  const isPaymentCancelled = searchParams.get("cancel");
  const [isPending, startTransition] = useTransition();

  const onClickHandler = () => {
    startTransition(async () => {
      await createCheckoutSession();
    });
  };

  return (
    <main className="flex flex-col items-center space-y-10">
      <H1>PetSoft access requires payment</H1>
      {!isPaymentSuccess && (
        <Button onClick={onClickHandler} disabled={isPending}>
          Buy lifetime access for $299
        </Button>
      )}
      {isPaymentSuccess && (
        <div className="flex flex-col justify-center items-center">
          <p className="text-sm text-green-600">Payment Successfull</p>
          <Button asChild>
            <Link href={"/app/dashboard"}>Access PetSoft</Link>
          </Button>
        </div>
      )}

      {isPaymentCancelled && (
        <p className="text-sm text-red-600">
          Payment Cancelled. You do not have access
        </p>
      )}
    </main>
  );
};

export default PaymentPage;
