"use client";
import CardWrapper from "@/components/auth/card-wrapper";
import BeatLoader from "@/components/shared/beat-loader";
import FormError from "@/components/auth/form-error";
import FormSuccess from "@/components/auth/form-success";
import { newVerification } from "@/server/actions/verification-actions";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const NewVerificationPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    // In "dev mode -> use strict".
    /**
     * useEffect fires twice due which upon successful email verification we will immediately
     * see token does not exists since upon successful verification we are also deleting the token
       below is the additional check for 2nd firing
    */

    if (!token) {
      setError("Missing Token!");
      return;
    }

    try {
      const newVerificationResponse = await newVerification(token);

      setSuccess(newVerificationResponse.success ?? "");
      setError(newVerificationResponse.error ?? "");
    } catch (error) {
      setError("Something went wrong while verifying");
    }
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to Login"
      backButtonHref="/login"
    >
      <div className="flex flex-col items-center w-full justify-center">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
};

export default NewVerificationPage;
