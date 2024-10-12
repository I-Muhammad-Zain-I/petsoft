import AuthForm from "@/components/signup-form";
import H1 from "@/components/h1";
import LoginForm from "@/components/login-form";
import Link from "next/link";
import React from "react";

type Props = {};

const Login = (props: Props) => {
  return (
    <main>
      <H1 className="text-center">Log In</H1>
      <LoginForm />
      <p className="mt-6 text-sm text-zinc-500">
        No Account yet? &nbsp;
        <Link href="/signup" className="mt-6 text-sm text-zinc-500">
          Sign Up
        </Link>
        .
      </p>
    </main>
  );
};

export default Login;
