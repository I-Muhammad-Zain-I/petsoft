"use client";
import { NewPasswordSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CardWrapper from "./card-wrapper";
import FormSuccess from "./form-success";
import FormError from "./form-error";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { newPassword } from "@/server/actions/new-password-actions";

const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof NewPasswordSchema>) => {
    if (!token) {
      setError("Missing Token!");
      return;
    }

    setError(null);
    setSuccess(null);

    const handleNewPassword = async (
      values: z.infer<typeof NewPasswordSchema>
    ) => {
      console.log(values);

      const response = await newPassword(values, token);

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess(response.success ?? null);
      }
    };

    startTransition(() => {
      handleNewPassword(values);
    });
  };

  return (
    <CardWrapper
      headerLabel="Forgot your password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/register"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Label htmlFor="password">Enter New Password</Label>
        <Input id="password" type="password" {...form.register("password")} />
        <FormError message={error} />
        <FormSuccess message={success ?? null} />
        <Button type="submit" className="w-full" disabled={isPending}>
          Reset Password
        </Button>
      </form>
    </CardWrapper>
  );
};

export default NewPasswordForm;
