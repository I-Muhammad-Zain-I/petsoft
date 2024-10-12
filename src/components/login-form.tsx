"use client";

import { Label } from "./ui/label";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { login, signUp } from "@/lib/actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/lib/validations";
import { z } from "zod";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import SocialButton from "./social-button";

const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // const [isPending, startTransition] = useTransition();

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
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {/* {errors.email && <p className="text-red-500">{errors.email.message}</p>} */}
      </div>
      <div className="mb-4 mt-2 space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" {...register("password")} />
      </div>
      <FormError message={error} />
      <FormSuccess message={success} />
      <SocialButton />
      <div className="py-4">
        <Button type="submit">Log In</Button>
      </div>
    </form>
  );
};

export default LoginForm;
