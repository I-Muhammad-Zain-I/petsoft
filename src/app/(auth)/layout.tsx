import React from "react";
import Logo from "@/components/logo";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
type AuthLayoutProps = {
  children: React.ReactNode;
};

const layout = async ({ children }: AuthLayoutProps) => {
  const session = await auth();

  return (
    <div className="flex flex-col gap-y-5 justify-center items-center min-h-screen">
      <SessionProvider session={session}>{children}</SessionProvider>
    </div>
  );
};

export default layout;
