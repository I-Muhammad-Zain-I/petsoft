"use client";
import { ResetSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CardWrapper from "./card-wrapper";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { Button } from "../ui/button";
import { resetPassword } from "@/server/actions/reset-actions";

const ResetPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError(null);
    setSuccess(null);
    console.log("reset-passow-frorm");
    const handleReset = async (values: z.infer<typeof ResetSchema>) => {
      console.log(values);
      const response = await resetPassword(values);
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess(response.success ?? null);
      }
    };

    startTransition(() => {
      handleReset(values);
    });
  };

  return (
    <CardWrapper
      headerLabel="Forgot your password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/register"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...form.register("email")} />
        <FormError message={error} />
        <FormSuccess message={success ?? null} />
        <Button type="submit" className="w-full" disabled={isPending}>
          Send Reset Email
        </Button>
      </form>
    </CardWrapper>
  );
};

export default ResetPasswordForm;
