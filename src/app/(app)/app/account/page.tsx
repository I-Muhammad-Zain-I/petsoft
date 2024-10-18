import { auth } from "@/auth";
import SignOutBtn from "@/components/auth/sign-out-btn";
import ContentBlock from "@/components/content-block";
import H1 from "@/components/h1";
import React from "react";

type Props = {};

const Page = async (props: Props) => {
  const session = await auth();

  return (
    <main>
      <H1 className="my-8 text-white">Your Account</H1>

      <ContentBlock className="h-[500px] flex flex-col justify-center items-center">
        <p>Logged in as {session?.user.name}</p>
        <SignOutBtn />
      </ContentBlock>
    </main>
  );
};

export default Page;
