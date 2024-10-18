import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/auth-routes";
import React from "react";
import { Button } from "../ui/button";
import googleLogo from "../../../public/googleLogo.svg";
import Image from "next/image";

const SocialButton = () => {
  const onClick = (provider: "google") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex items-center w-full">
      <Button
        size={"lg"}
        className={"w-full flex gap-x-2"}
        variant={"outline"}
        onClick={() => onClick("google")}
      >
        <Image src={googleLogo} alt="Petsoft Logo" width={24} height={24} />
        <p>Google</p>
      </Button>
    </div>
  );
};

export default SocialButton;
