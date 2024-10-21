"use client";

import { Label } from "../ui/label";
import React, { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { signUp } from "@/server/actions/user-actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema } from "@/lib/validations";
import { z } from "zod";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import SocialButton from "./social-button";
import { useRouter } from "next/navigation";
import { sleep } from "@/lib/utils";

const SignUpForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    handleSubmit,
    formState: { errors },
    reset: resetForm,
    register,
  } = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SignupSchema>) => {
    setError(null);
    setSuccess(null);

    const submitHandler = async (values: z.infer<typeof SignupSchema>) => {
      console.log("values", values);

      try {
        const response = await signUp(values);
        // const response = await login(values);

        if (response?.error) {
          resetForm();
          setError(response.error);
        }
        if (response?.success) {
          resetForm();
          setSuccess(response?.success);
          sleep(1500);
          router.push("/login");
        }
      } catch (error) {
        setError("Something went wrong!");
      }
    };

    // submitHandler(values);
    startTransition(() => {
      console.log("STARTED");
      submitHandler(values);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-1">
        <Label htmlFor="name">Name</Label>
        <Input id="name" type="name" {...register("name")} />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <div className="mb-4 mt-2 space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" {...register("password")} />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </div>
      <FormError message={error} />
      <FormSuccess message={success} />
      <SocialButton />
      <div className="py-4">
        <Button type="submit" disabled={isPending}>
          Sign Up
        </Button>
      </div>
    </form>
  );
};

export default SignUpForm;
