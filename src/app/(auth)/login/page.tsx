import AuthForm from "@/components/auth-form";
import H1 from "@/components/h1";
import Link from "next/link";
import React from "react";

type Props = {};

const Login = (props: Props) => {
  return (
    <main>
      <H1 className="text-center">Log In</H1>
      <AuthForm type={"login"} />
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
