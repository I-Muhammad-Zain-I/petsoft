"use client";

import { Label } from "../ui/label";
import React, { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { login } from "@/server/actions/user-actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/lib/validations";
import { z } from "zod";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import SocialButton from "./social-button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl")
    ? decodeURIComponent(searchParams.get("callbackUrl")!)
    : null; // Decode the callbackUrl

  const {
    handleSubmit,
    formState: { errors },
    reset: resetForm,
    register,
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError(null);
    setSuccess(null);

    const submitHandler = async (values: z.infer<typeof LoginSchema>) => {
      console.log("values", values);

      try {
        const response = await login(values);
        // const response = await login(values);

        if (response?.error) {
          resetForm();
          setError(response.error);
        }
        if (response?.success) {
          resetForm();
          setSuccess(response?.success);
        }
        if (response?.twoFactor) {
          setShowTwoFactor(true);
        }
      } catch (error) {
        setError("Something went wrong!");
      }
      if (callbackUrl) {
        router.push("/app/account");
      }
    };

    startTransition(() => {
      console.log("STARTED");
      submitHandler(values);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {showTwoFactor && (
        <div className="space-y-1">
          <Label htmlFor="code">code</Label>
          <Input id="code" type="text" {...register("code")} />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>
      )}
      {!showTwoFactor && (
        <div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-4 mt-2 space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" {...register("password")} />
          </div>

          <SocialButton />
          <p className="mt-6 text-sm text-zinc-500 text-right">
            <Link
              href="/reset-password"
              className="mt-6 text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              Forgot Password?
            </Link>
            .
          </p>
        </div>
      )}
      <FormError message={error} />
      <FormSuccess message={success} />
      <div className="py-4">
        <Button type="submit">{showTwoFactor ? "Verify" : "Login"}</Button>
      </div>
    </form>
  );
};

export default LoginForm;
