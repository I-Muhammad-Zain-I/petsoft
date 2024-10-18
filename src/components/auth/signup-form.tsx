"use client";

import { Label } from "../ui/label";
import React, { useState } from "react";
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

const SignUpForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // const [isPending, startTransition] = useTransition();

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
        }
      } catch (error) {
        setError("Something went wrong!");
      }
    };

    submitHandler(values);
    // startTransition(() => {
    //   console.log("STARTED");
    //   handleLogin(values);
    // });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-1">
        <Label htmlFor="name">Name</Label>
        <Input id="name" type="name" {...register("name")} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
      </div>
      <div className="mb-4 mt-2 space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" {...register("password")} />
      </div>
      <FormError message={error} />
      <FormSuccess message={success} />
      <SocialButton />
      <div className="py-4">
        <Button type="submit">Sign Up</Button>
      </div>
    </form>
  );
};

export default SignUpForm;