"use client";

import SignOutBtn from "@/components/auth/sign-out-btn";
import ContentBlock from "@/components/content-block";
import H1 from "@/components/h1";
import React, { useOptimistic, useState, useTransition } from "react";
import { PersonIcon } from "@radix-ui/react-icons";
import { toggleTwoFactor } from "@/server/actions/two-factor-actions";
import { Switch } from "@/components/ui/switch";
import { useSession } from "next-auth/react";
import { toastHandler } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const AccountPage = () => {
  const { data: session } = useSession();
  const [toggle, setToggle] = useState(session?.user.isTwoFactorEnabled);
  const [isLoading, setIsLoading] = useState(false);

  const twoFactorChangeHandler = async () => {
    setIsLoading(true);

    const response = await toggleTwoFactor();
    setToggle(response.isTwoFactorEnabled);

    toastHandler(response);
    setIsLoading(false);
  };

  return (
    <main>
      <H1 className="my-8 text-white">Your Account</H1>
      <ContentBlock className="h-[500px] flex flex-col justify-center items-center gap-y-5">
        <PersonIcon className="bg-zinc-900 text-slate-100 w-20 h-20 rounded-full" />
        <p>Logged in as {session?.user.name}</p>
        {!session?.user.isOAuth && (
          <div className="flex gap-x-8 items-center">
            <Label htmlFor="twoFactor">Two Factor Authentication</Label>

            <Switch
              id="twoFactor"
              checked={toggle}
              onCheckedChange={twoFactorChangeHandler}
              disabled={isLoading}
            />
          </div>
        )}
        <SignOutBtn />
      </ContentBlock>
    </main>
  );
};

export default AccountPage;
