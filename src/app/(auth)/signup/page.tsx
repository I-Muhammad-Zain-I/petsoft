import SignupForm from "@/components/auth/signup-form";
import H1 from "@/components/h1";
import Link from "next/link";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  return (
    <main>
      <H1 className="text-center">Sign Up</H1>
      <SignupForm />
      <p className="mt-6 text-sm text-zinc-500">
        Already have an account? &nbsp;
        <Link href="/login" className="mt-6 text-sm text-zinc-500">
          Log In
        </Link>
        .
      </p>
    </main>
  );
};

export default Page;
