import { auth } from "@/auth";
import { SessionProvider, useSession } from "next-auth/react";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const AuthWrapper = async ({ children }: Props) => {
  const session = await auth();
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default AuthWrapper;
